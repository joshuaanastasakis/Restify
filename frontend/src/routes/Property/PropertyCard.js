import './styles.css'
import {NavLink} from "react-router-dom";
import {useEffect} from "react";
export default function PropertyCard(props) {
    const pathNoImage=require("../../assets/noimage.png");

    const {id, province, city, country, name, min_price, thumbnail} = props.data;
    console.log(thumbnail);

    return (
        <NavLink to={`/properties/${id}`} className="listing-card">
            <img className="listing-image" src={thumbnail ?? pathNoImage} />
                <div className="listing-details">
                    <span className="listing-details-item h14 fs14 fw800">{city}, {province}</span>
                    <span className="listing-details-item fs14 h14 fw400">{name}</span>
                    <span className="fs12 h14 fw200"><span
                        className="listing-details-item fs14 fw800">{min_price}</span> per night</span>
                    <div className="listing-details-item listing-rating-summary">
                        <i className="fa-solid fa-sharp fa-star-sharp"></i>
                        <span className="listing-rating-total fs12">4.98</span>
                        <span className="listing-reviews-total fs12">(40)</span>
                    </div>
                </div>
        </NavLink>
    );
}