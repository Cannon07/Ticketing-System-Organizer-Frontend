
// import config from "@/config/config.json";
// import { getListPage } from "@/lib/contentParser";
import OrganizerRegistrationForm from "@/components/OrganizerRegistrationForm";
import OrganizerPageHeader from "@/partials/OrganizerPageHeader";
// import SeoMeta from "@/partials/SeoMeta";
// import { RegularPage } from "@/types";


const OrganizerRegistration = async () => {
    //   const data: RegularPage = getListPage("contact/_index.md");
    //   const { frontmatter } = data;
    //   const { title, description, meta_title, image } = frontmatter;
    //   const { contact_form_action } = config.params;


    return (
        <>
            {
                /* <SeoMeta
            title={title}
            meta_title={meta_title}
            description={description}
            image={image}
            /> */
            }
            <OrganizerPageHeader title={"Organizer Registration"} />
            <section className="section-sm">
                <div className="container">
                    <div className="row px-4">
                            <OrganizerRegistrationForm />
                    </div>
                </div>
            </section>
        </>
    );
};

export default OrganizerRegistration;
