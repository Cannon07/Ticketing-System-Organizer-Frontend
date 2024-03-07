'use client'

import { useRouter } from "next/navigation";

const NotRegistered = () => {

    const router = useRouter()
    return (
      <>
  
        <section className="section-sm text-center">
          <div className="container">
            <div className="row justify-center">
              <div className="sm:col-10 md:col-8 lg:col-6">
                <h1 className="h2 mb-4">Page Not Available</h1>
                <div className="content">
                  <p>
                    We are sorry, but it seems like the page you are looking for is
                    temporarily unavailable.
                  </p>
                  <p>
                    <strong>
                      To access this page, you need to register as organizer first.
                    </strong>{" "}
                 
                  </p>
                  <button className="btn-sm btn-primary" onClick={()=>router.push('/register-organizer')}>Register Now</button>
                </div>
  
              </div>
            </div>
          </div>
  
        </section>
  
      </>
    );
  };
  
  export default NotRegistered
  