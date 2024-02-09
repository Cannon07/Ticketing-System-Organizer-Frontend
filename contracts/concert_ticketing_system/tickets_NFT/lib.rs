#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub use self::tickets_NFT::TicketsNftRef;
pub use self::tickets_NFT::Error;

#[ink::contract]
mod tickets_NFT {
    
    use ink::storage::Mapping;
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;

    use scale::{
        Decode,
        Encode,
    };

    pub type TokenId = u32;

    #[ink(storage)]
    #[derive(Default)]
    pub struct TicketsNft {
        tiers: Mapping<String, u32>,
        token_tier: Mapping<TokenId, String>, 
        booked_seats_count: Mapping<String, u32>,
        token_owner: Mapping<TokenId, AccountId>,
        owned_tokens: Mapping<AccountId, Vec<u32>>,
        owned_tokens_count: Mapping<AccountId, u32>,
        token_id: u32,
    }

    #[derive(Encode, Decode, Debug, PartialEq, Eq, Copy, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotOwner,
        TokenExists,
        TokenNotFound,
        CannotInsert,
        CannotFetchValue,
        NotAllowed,
        NoSeatsAvailable,
        InvalidTier,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    impl TicketsNft {
        #[ink(constructor)]
        pub fn new(tier_list: Vec<String>, seats_list: Vec<u32>) -> Self {
            let mut tiers = Mapping::default();
            let mut booked_seats_count = Mapping::default();
            for i in 0..tier_list.len() {
                tiers.insert(&tier_list[i], &seats_list[i]);
                booked_seats_count.insert(&tier_list[i], &0);
            }
            Self {
                tiers,
                token_tier: Mapping::default(),
                booked_seats_count,
                token_owner: Mapping::default(),
                owned_tokens: Mapping::default(),
                owned_tokens_count: Mapping::default(),
                token_id: 0,
            }
        }

        #[ink(message)]
        pub fn get_tiers(&self, tier: String) -> Option<u32> {
            self.tiers.get(tier)
        }
        
        #[ink(message)]
        pub fn get_booked_seats_by_tier(&self, tier: String) -> Option<u32> {
            self.booked_seats_count.get(tier)
        }

        #[ink(message)]
        pub fn get_token_tier(&self, id: TokenId) -> Result<String> {
            if !self.token_tier.contains(&id) {
                return Err(Error::TokenNotFound);
            }

            Ok(self.token_tier.get(id).unwrap())
        }

        #[ink(message)]
        pub fn get_owned_tokens(&self, owner: AccountId) -> Result<Vec<u32>> {
            if !self.owned_tokens.contains(owner) {
                return Err(Error::TokenNotFound);
            }
            return Ok(self.owned_tokens.get(owner).unwrap())
        }

        #[ink(message)]
        pub fn balance_of(&self, owner: AccountId) -> u32 {
            self.balance_of_or_zero(&owner)
        }

        #[ink(message)]
        pub fn owner_of(&self, id: TokenId) -> Option<AccountId> {
            self.token_owner.get(id)
        }

        #[ink(message)]
        pub fn transfer(
            &mut self,
            from: AccountId,
            destination: AccountId,
            id: TokenId,
        ) -> Result<()> {
            self.transfer_token_from(&from, &destination, id)?;
            Ok(())
        }

        #[ink(message)]
        pub fn mint(&mut self, from: AccountId, tier: String) -> Result<u32> {
            if !self.tiers.contains(&tier) {
                return Err(Error::InvalidTier);
            }

            if self.booked_seats_count.get(&tier) == self.tiers.get(&tier) {
                return Err(Error::NoSeatsAvailable);
            }

            let updated_seats = self.booked_seats_count.get(&tier).map(|c| c + 1).unwrap();
            self.booked_seats_count.insert(&tier, &updated_seats);
            self.token_tier.insert(self.token_id, &tier);

            self.add_token_to(&from, self.token_id)?;

            let mut tickets_vec;
            if self.owned_tokens.contains(from) {
                tickets_vec = self.owned_tokens.get(from).unwrap();
            } else {
                tickets_vec = Vec::new();
            }
            tickets_vec.push(self.token_id);
            self.owned_tokens.insert(from, &tickets_vec);

            self.token_id += 1;

            Ok(self.token_id - 1)
        }

        #[ink(message)]
        pub fn burn(&mut self, from: AccountId, id: TokenId) -> Result<()> {
            let Self {
                token_owner,
                owned_tokens_count,
                booked_seats_count,
                token_tier,
                ..
            } = self;

            let owner = token_owner.get(id).ok_or(Error::TokenNotFound)?;
            if owner != from {
                return Err(Error::NotOwner)
            };

            let ticket_tier = token_tier.get(&id).unwrap();  
            let booked_seats = booked_seats_count.get(&ticket_tier).map(|c| c - 1).unwrap();
            booked_seats_count.insert(ticket_tier, &booked_seats);
            token_tier.remove(id);

            let count = owned_tokens_count
                .get(from)
                .map(|c| c - 1)
                .ok_or(Error::CannotFetchValue)?;
            owned_tokens_count.insert(from, &count);
            token_owner.remove(id);

            Ok(())
        }

        fn transfer_token_from(
            &mut self,
            from: &AccountId,
            to: &AccountId,
            id: TokenId,
        ) -> Result<()> {
            let owner = self.token_owner.get(id).ok_or(Error::TokenNotFound)?;
            if owner != *from {
                return Err(Error::NotOwner)
            };
            self.remove_token_from(from, id)?;
            self.add_token_to(to, id)?;
            
            Ok(())
        }

        fn remove_token_from(
            &mut self,
            from: &AccountId,
            id: TokenId,
        ) -> Result<()> {
            let Self {
                token_owner,
                owned_tokens_count,
                ..
            } = self;

            if !token_owner.contains(id) {
                return Err(Error::TokenNotFound)
            }

            let count = owned_tokens_count
                .get(from)
                .map(|c| c - 1)
                .ok_or(Error::CannotFetchValue)?;
            owned_tokens_count.insert(from, &count);
            token_owner.remove(id);

            Ok(())
        }

        fn add_token_to(&mut self, to: &AccountId, id: TokenId) -> Result<()> {
            let Self {
                token_owner,
                owned_tokens_count,
                ..
            } = self;

            if token_owner.contains(id) {
                return Err(Error::TokenExists)
            }

            if *to == AccountId::from([0x0; 32]) {
                return Err(Error::NotAllowed)
            };

            let count = owned_tokens_count.get(to).map(|c| c + 1).unwrap_or(1);

            owned_tokens_count.insert(to, &count);
            token_owner.insert(id, to);

            Ok(())
        }

        fn balance_of_or_zero(&self, of: &AccountId) -> u32 {
            self.owned_tokens_count.get(of).unwrap_or(0)
        }
    }

    #[cfg(test)]
    mod tests {

        use super::*;

        #[ink::test]
        fn constructor_works() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![10, 20];
            
            let contract = TicketsNft::new(tier_list, seats_list);
            assert_eq!(contract.get_tiers("tier1".to_string()).unwrap(), 10);
            assert_eq!(contract.get_booked_seats_by_tier("tier1".to_string()).unwrap(), 0);
        }

        #[ink::test]
        fn mint_works() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![10, 20];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut tickets_NFT = TicketsNft::new(tier_list, seats_list);
            assert_eq!(tickets_NFT.owner_of(1), None);
            assert_eq!(tickets_NFT.balance_of(accounts.alice), 0);
            assert_eq!(tickets_NFT.mint(accounts.alice, "tier1".to_string()), Ok(0));
            assert_eq!(tickets_NFT.get_owned_tokens(accounts.alice), Ok(Vec::from([0])));
            assert_eq!(tickets_NFT.balance_of(accounts.alice), 1);
            assert_eq!(tickets_NFT.get_booked_seats_by_tier("tier1".to_string()).unwrap(), 1);
            assert_eq!(tickets_NFT.get_token_tier(0).unwrap(), "tier1");
        }

        //#[ink::test]
        //fn mint_existing_should_fail() {
        //    let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
        //    let seats_list = vec![10, 20];
        //    let accounts =
        //        ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
        //    let mut erc721 = TicketsNft::new(tier_list, seats_list);
        //    assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Ok(()));
        //    //assert_eq!(1, ink::env::test::recorded_events().count());
        //    assert_eq!(erc721.balance_of(accounts.alice), 1);
        //    assert_eq!(erc721.owner_of(0), Some(accounts.alice));
        //    assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Err(Error::TokenExists));
        //}

        #[ink::test]
        fn mint_no_available_seats_should_fail() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![1, 2];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut erc721 = TicketsNft::new(tier_list, seats_list);
            assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Ok(0));
            //assert_eq!(1, ink::env::test::recorded_events().count());
            assert_eq!(erc721.balance_of(accounts.alice), 1);
            assert_eq!(erc721.owner_of(0), Some(accounts.alice));
            assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Err(Error::NoSeatsAvailable));
        }

        #[ink::test]
        fn mint_invalid_tier_should_fail() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![1, 2];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut erc721 = TicketsNft::new(tier_list, seats_list);
            assert_eq!(erc721.mint(accounts.alice, "tier".to_string()), Err(Error::InvalidTier));
        }

        #[ink::test]
        fn transfer_works() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![10, 20];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut erc721 = TicketsNft::new(tier_list, seats_list);
            assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Ok(0));
            assert_eq!(erc721.balance_of(accounts.alice), 1);
            assert_eq!(erc721.balance_of(accounts.bob), 0);
            //assert_eq!(1, ink::env::test::recorded_events().count());
            assert_eq!(erc721.transfer(accounts.alice, accounts.bob, 0), Ok(()));
            //assert_eq!(2, ink::env::test::recorded_events().count());
            assert_eq!(erc721.balance_of(accounts.bob), 1);
        }

        #[ink::test]
        fn invalid_transfer_should_fail() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![10, 20];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut erc721 = TicketsNft::new(tier_list, seats_list);
            assert_eq!(erc721.transfer(accounts.alice, accounts.bob, 2), Err(Error::TokenNotFound));
            assert_eq!(erc721.owner_of(2), None);
            assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Ok(0));
            assert_eq!(erc721.balance_of(accounts.alice), 1);
            assert_eq!(erc721.owner_of(0), Some(accounts.alice));
            set_caller(accounts.bob);
            assert_eq!(erc721.transfer(accounts.bob, accounts.eve, 0), Err(Error::NotOwner))
        }

        #[ink::test]
        fn burn_works() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![10, 20];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut erc721 = TicketsNft::new(tier_list, seats_list);
            assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Ok(0));
            assert_eq!(erc721.balance_of(accounts.alice), 1);
            assert_eq!(erc721.owner_of(0), Some(accounts.alice));
            assert_eq!(erc721.get_token_tier(0).unwrap(), "tier1".to_string());
            assert_eq!(erc721.get_booked_seats_by_tier("tier1".to_string()).unwrap(), 1);
            assert_eq!(erc721.burn(accounts.alice, 0), Ok(()));
            assert_eq!(erc721.balance_of(accounts.alice), 0);
            assert_eq!(erc721.owner_of(0), None);
            assert_eq!(erc721.get_token_tier(0), Err(Error::TokenNotFound));
            assert_eq!(erc721.get_booked_seats_by_tier("tier1".to_string()).unwrap(), 0);
        }

        #[ink::test]
        fn burn_fails_token_not_found() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![10, 20];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut erc721 = TicketsNft::new(tier_list, seats_list);
            assert_eq!(erc721.burn(accounts.alice, 1), Err(Error::TokenNotFound));
        }

        #[ink::test]
        fn burn_fails_not_owner() {
            let tier_list = vec!["tier1".to_string(), "tier2".to_string()];
            let seats_list = vec![10, 20];
            let accounts =
                ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut erc721 = TicketsNft::new(tier_list, seats_list);
            assert_eq!(erc721.mint(accounts.alice, "tier1".to_string()), Ok(0));
            set_caller(accounts.eve);
            assert_eq!(erc721.burn(accounts.eve, 0), Err(Error::NotOwner));
        }

        fn set_caller(sender: AccountId) {
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(sender);
        }
    }
}
