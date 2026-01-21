import { CardData } from "./CardData";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

function Home(){

    return(
        <div>
            
            <NavBar/>
          
            <div className="d-flex flex-wrap gap-3 pt-4">
            {CardData.map((item, i) => (
                <div className="card" style={{ width: "15rem" }} key={i}>
                <img src={item.img} className="card-img-top" alt={item.title || "image"} />
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                </div>
                </div>
            ))}
            </div>

            <Footer/>


         </div>




        
    );
}

export {Home};