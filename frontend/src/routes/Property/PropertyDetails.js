import {NavLink, useNavigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import { getProperty } from '../../services/Property'
import { useAuth } from "../../hooks/useAuth";
import api, {headerContent} from "../../services/API";
import './styles.css'
import path from "../../assets/samplehouse1.jpeg";
import pathNoImage from "../../assets/noimage.png";

export function PropertyDetails() {
    const path=require("../../assets/samplehouse1.jpeg");
    const pathNoProfile=require("../../assets/noprofile.png");
    const { propertyid } = useParams();
    const { user } = useAuth();

    const navigate = useNavigate();

    let [property, setProperty] = useState(null);
    let [images, setImages] = useState([]);

    let [maxGuestsArray, setMaxGuestsArray] = useState([]);
    let [guests, setGuests] = useState(0);

    let [reservationStartDate, setReservationStartDate] = useState('');
    let [reservationEndDate, setReservationEndDate] = useState('');
    let [dateError, setDateError] = useState("");
    let [dayCount, setDayCount] = useState(0)

    let [rate, setRate] = useState(0);

    let [reservable, setReservable] = useState(false);

    let [listings, setListings] = useState([]);

    useEffect(() => {
        // getProperty(propertyid).then(data => setProperty(data))
        api.get(`properties/${propertyid}/details/`, {}, headerContent.json)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setProperty(data);
                let imagemap = new Map(data.images.map(obj => [obj[0], obj[1]]))
                let finalImages = [];

                for (let i=0; i < 5; i++) {
                    if (!imagemap.get(i+1)) {
                        imagemap.set((i+1), pathNoImage);
                    }
                    finalImages.push(imagemap.get(i+1))
                }
                console.log(finalImages);

                let tmpArr = [];
                for (let i=1; i <= data.max_guests; i++) {
                    tmpArr.push(i);
                }

                setMaxGuestsArray(tmpArr);

                setImages(finalImages)
            });
    }, [])

    const parseDate = (str) => {
        if (str==='' || str===null) return null;
        let date = str.split('-');
        return new Date(date[0], date[1], date[2])
    }

    useEffect(() => {
        const today = new Date().toLocaleString('en-CA', {timeZone: 'EST'}).substring(0,10)
        const start = reservationStartDate.substring(0,10)
        const end = reservationEndDate.substring(0,10)

        if (start.length === 0 || !start || end.length===0 || !end) {
            setReservable(false)
            setDateError("Both dates are required")
        }

        else if (start > end) {
            setDateError("Start date cannot be before end date");
            setReservable(false)
        } else if (start < today || end < today) {
            setReservable(false)
            setDateError("Dates cannot be in the past");
        } else {
            getListings();

            const timediff = parseDate(reservationEndDate) - parseDate(reservationStartDate)
            const numdays = Math.ceil(timediff / (1000 * 3600 * 24)) + 1;
            setDayCount(numdays)
            setDateError(null);
            setReservable(true)
        }

    }, [reservationStartDate, reservationEndDate])

    const getListings = (page=1) => {
        api.post(`properties/${propertyid}/listings/list/${page}/`, {start_dt: reservationStartDate, end_dt: reservationEndDate}, headerContent.json)
            .then(res => res.data)
            .then(data => {
                console.log(data);
                if (data) {
                    const price = data.data[0].price;
                    console.log("Listing price:", price);

                    const timediff = parseDate(reservationEndDate) - parseDate(reservationStartDate)
                    const numdays = Math.ceil(timediff / (1000 * 3600 * 24)) + 1;
                    setDayCount(numdays)
                    setRate(price)
                }
                let newListings = [...listings, ...data.data];
                setListings(newListings)

                if (data.next) getListings(data.next)
                else return;
            })
            .catch((e) => {
                let data = e.response.data;
                if (data[0]==="'" && data[data.length-1]==="'") {
                    data = data.slice(1, data.length-1);
                }
                setDateError(data)
                setReservable(false)
                if (rate) setRate(0);
                if (dayCount) setDayCount(0);

                console.log(e.response);
            })
    }

    const handleReserveClick = () => {
        console.log("Reserve clicked");
        // TODO call create reservation API
    }
    
    return (
        <div className={"property-details-container"}>
            <div className="property-header-container">
                    <button as={NavLink} id="editpropertybutton" onClick={() => navigate(`/properties/${propertyid}/edit`)}>Edit</button>
                <div className="property-header-item">
                    <h2 className="listing-item listing-header">{property ? property.name : ""}</h2>
                    <div className="listing-item listing-subheader">
                        <span className="listing-city-link">{property ? property.city : ""}, {property ? property.country : ""}</span>
                    </div>
                </div>
            </div>

            <div className="listing-item listing-image-gallery">
                {
                    images.map((i, idx) => {
                        return <img className={"listing-image-item"+(idx===0 ? " big" : "")} src={i} />
                    })
                }
            </div>
            <div className="listing-item col2 listing-details-container">
                <div className="listing-host-info-container">
                    <img className="headshot" id="host-headshot-thumbnail" src={pathNoProfile} />
                    <h2>Hosted By</h2>
                    <h3>{property && property.host.first_name}, {property && property.host.last_name}</h3>
                </div>
                <div className="horizontal-divider"></div>
                <div className="basic-amenities-labels">
                    <span>{property ? property.max_guests : ""} Guest{property && (property.max_guests > 1) ? "s" : ""}</span>
                    <span>{property ? property.num_bath : ""} Bathroom{property && (property.num_bath > 1) ? "s" : ""}</span>
                    <span>{property ? property.num_bed : ""} Bedroom{property && (property.num_bed > 1) ? "s" : ""}</span>
                </div>
                <div className="horizontal-divider"></div>
                <h2>Amenities</h2>
                <div className="other-amenities-labels">
                    {
                        property
                            ? property.amenities.length
                                ? property.amenities.map(a => <span key={a+"-"+property.id}>{a}</span>)
                                : <span>None</span>
                            : <></>
                    }
                </div>
            </div>
            <div className="listing-item col2 listing-reservation-container">
                <span className="fw800 fs24 h24">${rate || '-'} CAD <span className="fw200">night</span></span>
                <span className="date-error">{dateError}</span>
                <div className="listing-reservation-input">
                    <div className="date-selector-container">
                        <span className="date-selector-label fs14 fw600">Check-in</span>
                        <input type="date" className="date-selector" id="start-date-selector" value={reservationStartDate} onChange={(e) => setReservationStartDate(e.target.value)}/>
                    </div>
                    <div className="vertical-divider"></div>
                    <div className="date-selector-container">
                        <span className="date-selector-label fs14 fw600">Checkout</span>
                        <input type="date" className="date-selector" id="end-date-selector" value={reservationEndDate} onChange={(e) => setReservationEndDate(e.target.value)}/>
                    </div>
                    <div className="horizontal-divider"></div>
                    <select className="fs20" id="guest-selector">
                        {maxGuestsArray.map(v => <option value={v}>{v} guest{v===1 ? '' : 's'}</option>)}
                    </select>
                </div>
                <div className="listing-reservation-costs">
                    <span className="label fw200 fs16">subtotal</span>
                    <span className="fw800 fs16">${rate * dayCount || '-'}</span>
                    <span className="label fw200 fs16">fees</span>
                    <span className="fw800 fs16">${rate && 100 || '-'}</span>
                    <span className="label fw200 fs16">tax</span>
                    <span className="fw800 fs16">${(rate*dayCount) * 0.13 || '-'}</span>
                    <span className="label fw800 fs16">TOTAL</span>
                    <span className="fw800 fs16">${rate &&
                        (rate*dayCount + (100) + ((rate*dayCount)*0.13)) || '-'
                    }</span>
                </div>
                <button disabled={!reservable} id="reserve-button" className="fw600 fs20" onClick={() => handleReserveClick()}>RESERVE</button>
            </div>
            <div id="listing-reviews" className="listing-item listing-reviews-container">
                <h2 id="reviews-header">Reviews</h2>
                <div id="ratings-summary">
                    <div className="review-stars rating-stars-list">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                    </div>
                    <span className="label fw200 fs16">0</span>
                    <div className="review-stars rating-stars-list">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                    </div>
                    <span className="label fw200 fs16">0</span>
                    <div className="review-stars rating-stars-list">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                    </div>
                    <span className="label fw200 fs16">0</span>
                    <div className="review-stars rating-stars-list">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-regular fa-star"></i>
                    </div>
                    <span className="label fw200 fs16">0</span>
                    <div className="review-stars rating-stars-list">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                    </div>
                    <span className="label fw200 fs16">0</span>
                </div>
                <div className="reviews-container">
                    {/*<div className="review-card">*/}
                    {/*    <img className="headshot user-headshot-thumbnail" src="../assets/listings/House 1/pexels-photo-106399.jpeg" />*/}
                    {/*    <span className="review-username">User Name</span>*/}
                    {/*    <span className="review-date fs14 fw200">Feb 9, 2023</span>*/}
                    {/*    <div className="review-stars rating-stars-list">*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-regular fa-star"></i>*/}
                    {/*    </div>*/}
                    {/*    <p className="review-message">another one and another one and another one bites the dust another one and another one and another one bites the dust</p>*/}
                    {/*    <div className="reply-card">*/}
                    {/*        <span className="reply-host">Host Name</span>*/}
                    {/*        <span className="reply-date">Feb 9, 2023</span>*/}
                    {/*        <p className="reply-message">I agree, great job biting the dust</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="review-card">*/}
                    {/*    <img className="headshot user-headshot-thumbnail" src="../assets/listings/House 1/pexels-photo-106399.jpeg" />*/}
                    {/*    <span className="review-username">User Name</span>*/}
                    {/*    <span className="review-date fs14 fw200">Feb 9, 2023</span>*/}
                    {/*    <div className="review-stars rating-stars-list">*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-regular fa-star"></i>*/}
                    {/*    </div>*/}
                    {/*    <p className="review-message">another one and another one and another one bites the dust another one and another one and another one bites the dust</p>*/}
                    {/*    <div className="reply-card">*/}
                    {/*        <span className="reply-host">Host Name</span>*/}
                    {/*        <span className="reply-date">Feb 9, 2023</span>*/}
                    {/*        <p className="reply-message">I agree, great job biting the dust</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="review-card">*/}
                    {/*    <img className="headshot user-headshot-thumbnail" src="../assets/listings/House 1/pexels-photo-106399.jpeg" />*/}
                    {/*    <span className="review-username">User Name</span>*/}
                    {/*    <span className="review-date fs14 fw200">Feb 9, 2023</span>*/}
                    {/*    <div className="review-stars rating-stars-list">*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-regular fa-star"></i>*/}
                    {/*    </div>*/}
                    {/*    <p className="review-message">another one and another one and another one bites the dust another one and another one and another one bites the dust</p>*/}
                    {/*    <div className="reply-card">*/}
                    {/*        <span className="reply-host">Host Name</span>*/}
                    {/*        <span className="reply-date">Feb 9, 2023</span>*/}
                    {/*        <p className="reply-message">I agree, great job biting the dust</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*<div className="review-card">*/}
                    {/*    <img className="headshot user-headshot-thumbnail" src="../assets/listings/House 1/pexels-photo-106399.jpeg" />*/}
                    {/*    <span className="review-username">User Name</span>*/}
                    {/*    <span className="review-date fs14 fw200">Feb 9, 2023</span>*/}
                    {/*    <div className="review-stars rating-stars-list">*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-regular fa-star"></i>*/}
                    {/*    </div>*/}
                    {/*    <p className="review-message">another one and another one and another one bites the dust another one and another one and another one bites the dust</p>*/}
                    {/*</div>*/}
                    {/*<div className="review-card">*/}
                    {/*    <img className="headshot user-headshot-thumbnail" src="../assets/listings/House 1/pexels-photo-106399.jpeg" />*/}
                    {/*    <span className="review-username">User Name</span>*/}
                    {/*    <span className="review-date fs14 fw200">Feb 9, 2023</span>*/}
                    {/*    <div className="review-stars rating-stars-list">*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-solid fa-star"></i>*/}
                    {/*        <i className="fa-regular fa-star"></i>*/}
                    {/*    </div>*/}
                    {/*    <p className="review-message">another one and another one and another one bites the dust another one and another one and another one bites the dust</p>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}

/*

{
                !property
                ? <p>loading</p>
                :
                    <div>
                        <h1>Property {property.id} Details</h1>
                        <p>Name: {property.name}</p>
                        <p>Amnenities: {property.amenities.length > 0 ? property.amenities.join(", ") : "None"}</p>
                    </div>
            }
 */