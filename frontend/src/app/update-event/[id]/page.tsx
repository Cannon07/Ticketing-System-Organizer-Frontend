
import UpdateEventForm from "@/components/UpdateEventForm";
import OrganizerPageHeader from "@/partials/OrganizerPageHeader";


interface UpdateEventProps {
    params: {
      id: string; 
    };
  }
  
  const UpdateEvent: React.FC<UpdateEventProps> = ({ params }) => {
    const { id } = params;

    return (
        <>

            <OrganizerPageHeader title={"Update Event"} />
            <section className="section-sm">
                <div className="container">
                    <div className="row px-4">
                        <UpdateEventForm id={id}/>
                        
                    </div>
                </div>
            </section>
        </>
    );
};

export default UpdateEvent;
