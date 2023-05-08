import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api, {headerContent} from "../../../services/API";
import './styles.css'

export function ListingRow({propertyid, listing, onDelete, onAdd}) {
    let [editing, setEditing] = useState(false);
    let [error, setError] = useState('');

    let [startDate, setStartDate] = useState(null);
    let [endDate, setEndDate] = useState(null);
    let [price, setPrice] = useState(null);

    const updateListing = () => {
        var changes = {
            start_dt: startDate,
            end_dt: endDate,
            price: price,
        };

        api.post(`properties/${propertyid}/listings/${listing.id}`, changes, headerContent.json)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setEditing(false)
            })
            .catch(e => {
                console.log(e)
            })
    }

    const handleSave = () => {
        if (editing) {
            let data = {};
            if (startDate!==listing.start_dt) data['start_dt'] = startDate;
            if (endDate!==listing.end_dt) data['end_dt'] = endDate;
            if (price!==listing.price) data['price'] = +price;

            if (listing.id===-1 && error==='') {
                // validate inputs
                if (startDate==='') {
                    setError("start date required")
                    return;
                }
                else if (endDate==='') {
                    setError("end date required")
                    return;
                }
                else if (price===0) {
                    setError("price required")
                    return;
                }
                else {
                    api.post(
                        `properties/${propertyid}/listings/create/`,
                        data,
                        headerContent.json
                    )
                        .then(res => res.data)
                        .then(data => {
                            console.log(data)
                            onAdd(data)
                            setStartDate(data.start_dt)
                            setEndDate(data.end_dt)
                            setPrice(data.price)
                            setEditing(false)
                            setError('')
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            } else if (listing.id!==-1) {

                api.post(
                    `properties/${propertyid}/listings/${listing.id}/`,
                    data,
                    headerContent.json
                )
                    .then(res => res.data)
                    .then(data => {
                        console.log(data)
                        setStartDate(data.start_dt)
                        setEndDate(data.end_dt)
                        setPrice(data.price)
                        setEditing(false)
                        setError('')
                    })
                    .catch(e => {
                        console.log(e.response.data)
                        setError(e.response.data)
                    })
                }

        }
    }

    const handleDelete = () => {
        console.log("delete")
        api.delete(
            `properties/${propertyid}/listings/${listing.id}/`,
            {},
            headerContent.json
        )
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setEditing(false)
                setError('')
                onDelete(listing.id);
            })
            .catch(e => {
                console.log(e.response.data)
                setError(e.response.data)
            })
    }

    const handleCancel = () => {
        console.log("cancel")
        setStartDate(listing.start_dt)
        setEndDate(listing.end_dt)
        setPrice(listing.price)
        setEditing(false)
        setError('')
    }

    const handleStartDateChange = (event) => {
        console.log(event.target.value)
        const newDate = parseDate(event.target.value);
        const curDate = parseDate(listing.start_dt);
        if (newDate!==curDate) {
            setEditing(true);
        }
        if (newDate > parseDate(endDate)) {
            setError("Start cannot be after end")
        } else {
            setError('')
        }
        setStartDate(event.target.value)
    }

    const handleEndDateChange = (event) => {
        console.log(event.target.value)
        const newDate = parseDate(event.target.value);
        const curDate = parseDate(listing.end_dt);
        if (newDate!==curDate) {
            setEditing(true);
        }
        if (parseDate(startDate) > newDate) {
            setError("Start cannot be after end")
        } else {
            setError('')
        }
        setEndDate(event.target.value)
    }

    const handlePriceChange = (event) => {
        const newPrice = event.target.value;
        const curPrice = price;
        if (newPrice !== curPrice) {
            setEditing(true)
        }

        if (newPrice < 0) setError("price cannot be negative");
        else setError('')
        setPrice(newPrice)
    }

    const parseDate = (str) => {
        if (str==='' || str===null) return null;
        let date = str.split('-');
        return new Date(date[0], date[1], date[2])
    }

    useEffect(() => {
        const {start_dt, end_dt, price, id} = listing;
        setStartDate(start_dt)
        setEndDate(end_dt)
        setPrice(price)
    }, [])

    useEffect(() => {
        // onEdit(editing)
    }, [editing])

    return (
        <div className="listing-list-row-container">
            <span class="date-error">{error}</span>
            <div className="listing-list-row-item">
                {listing.id !== -1 && <a className="fa-solid fa-trash"  onClick={() => handleDelete()}></a>}
                {listing.id === -1 && <i className={"fa-solid fa-plus"}/>}
                <input type="date" value={startDate} onChange={(e) => handleStartDateChange(e)}/>
                <span>to</span>
                <input type="date" value={endDate} onChange={(e) => handleEndDateChange(e)}/>
                <input type="number" value={price} onChange={(e) => handlePriceChange(e)}/>
                {/*{!editing && <a className="fa-solid fa-pen-to-square"  onClick={() => handleEdit()}></a>}*/}
                {editing && !error && <a className="fa-solid fa-save"  onClick={() => handleSave()}></a>}
                {editing && <a className="fa-solid fa-ban"  onClick={() => handleCancel()}></a>}
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