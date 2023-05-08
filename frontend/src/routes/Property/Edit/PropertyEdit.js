import {useNavigate, useParams} from "react-router-dom";
import { useState, useEffect } from "react";
import api, {headerContent} from "../../../services/API";
import './styles.css'
import {ListingRow} from "./ListingRow";

const editingIcon = {
    true: "fa-solid fa-check",
    false: "fa-solid fa-pen-to-square",
}

const AMENITY_OPTIONS = [
    "gym",
    "laundry",
    "dryer",
    "kitchen",
    "AC",
    "heat",
    "BBQ",
    "sauna",
    "hot tub",
    "fireplace",
]

const parseDate = (str) => {
    if (str==='' || str===null) return null;
    let date = str.split('-');
    return new Date(date[0], date[1], date[2])
}

export function PropertyEdit() {
    const path=require("../../../assets/samplehouse1.jpeg");
    const pathNoImage=require("../../../assets/noimage.png");
    const { propertyid } = useParams();

    const navigate = useNavigate();

    let [property, setProperty] = useState(null);
    let [images, setImages] = useState([]);

    let [editing, setEditing] = useState(false);

    let [updateName, setUpdateName] = useState(null)
    let [updateNameEdit, setUpdateNameEdit] = useState(false);

    let [updateLocation, setUpdateLocation] = useState(null)
    let [updateLocationEdit, setUpdateLocationEdit] = useState(false);

    let [updateGuests, setUpdateGuests] = useState(0);
    let [updateBeds, setUpdateBeds] = useState(0);
    let [updateBaths, setUpdateBaths] = useState(0);

    let [updateAmenities, setUpdateAmenities] = useState(0);

    let [listings, setListings] = useState([]);

    const updatePropertyDetails = (updates) => {
        const {name, city, province, country, amenities, guests, beds, baths} = updates;

        var changes = {};
        if (name && name!==property.name) changes['name']=name;
        if (city && city!==property.city) changes['city']=city;
        if (province && province!==property.province) changes['province']=province;
        if (country && country!==property.country) changes['country']=country;
        if (guests && guests!==property.max_guests) changes['max_guests']=guests;
        if (beds && beds!==property.num_bed) changes['num_bed']=beds;
        if (baths && baths!==property.num_bath) changes['num_bath']=baths;
        if (amenities && amenities.every(a => amenities.includes(a))) changes['amenities']=amenities
        console.log(changes)

        if (changes.length===0) return;

        api.post(`properties/${property.id}/`, changes, headerContent.json)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setProperty(data)
                let newListings = data.listings.sort((a,b) => {
                    // console.log(a,b)
                    if (parseDate(a.start_dt) > parseDate(b.start_dt)) return 1;
                    if (parseDate(a.start_dt) < parseDate(b.start_dt)) return -1;
                    return 0;
                })
                console.log(newListings)
                setListings(newListings)
            })
            .catch(e => {
                console.log(e)
            });
    }

    useEffect(() => {
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

                setImages(finalImages)

                setUpdateName(data.name)
                setUpdateLocation(data.city+", "+data.province+", "+data.country)
                setUpdateGuests(data.max_guests);
                setUpdateBeds(data.num_bed);
                setUpdateBaths(data.num_bath);
                setUpdateAmenities(data.amenities)

                let newListings = data.listings.sort((a,b) => {
                    // console.log(a,b)
                    if (parseDate(a.start_dt) > parseDate(b.start_dt)) return 1;
                    if (parseDate(a.start_dt) < parseDate(b.start_dt)) return -1;
                    return 0;
                })
                console.log(newListings)
                setListings(newListings)
            });
    }, [])

    useEffect(() => {
        if (updateLocationEdit || updateNameEdit) {
            setEditing(true);
        } else {
            setEditing(false);
        }
    }, [updateLocationEdit, updateNameEdit])

    const handleTitleEdit = (event) => {
        if (updateNameEdit) {
            // save new title
            setUpdateNameEdit(false);
            updatePropertyDetails({name: updateName})
        }
        else {
            setUpdateNameEdit(true);
            setEditing( true);
        }
    }

    const handleTitleChange = (event) => {
        const newTitle = event.target.value;
        // if (newTitle==='') return;
        setUpdateName(newTitle);
        updatePropertyDetails({title: newTitle})
    }

    const handleLocationEdit = (event) => {
        if (updateLocationEdit) {
            let location = updateLocation.split(",").map(l => l.trim()).filter(l => l!=='');
            if (location.length !== 3) return;
            setUpdateLocationEdit(false)
            console.log(location);
            const [city, province, country] = location;
            updatePropertyDetails({city, province, country})
        }
        else {
            setUpdateLocationEdit(true);
            setEditing(true);
        }
    }

    const handleLocationChange = (event) => {
        const newLocation = event.target.value;
        // if (newLocation==='') return;
        setUpdateLocation(newLocation);
    }

    const handleGuestChange = (event) => {
        const newGuests = event.target.value;
        console.log("New Guest:", newGuests)
        // if (newGuests==='') return;
        setUpdateGuests(newGuests);
        updatePropertyDetails({guests: +newGuests})

    }

    const handleBedChange = (event) => {
        const newBeds = event.target.value;
        console.log("New Bed:", newBeds)
        // if (newBeds==='') return;
        setUpdateBeds(newBeds);
        updatePropertyDetails({beds: +newBeds})
    }

    const handleBathChange = (event) => {
        const newBaths = event.target.value;
        console.log("New Bath:", newBaths)
        // if (newBaths==='') return;
        setUpdateBaths(newBaths);
        updatePropertyDetails({baths: +newBaths})
    }

    const uploadImage = (e, index) => {
        let file = e.target.files[0];
        console.log(file);
        let data = {
            "file": file,
            "num": index+1,
        }
        api.post(
            `properties/${property.id}/uploadimage/${index+1}/`,
            data,
            // {headers: {"content-type": "multipart/form-data"}}
            headerContent.image
        )
        .then(res => {
            const data = res.data
            console.log(data);
            let tempImages = [...images];
            images[index] = data.url
            setImages(tempImages)
            console.log(images);
            console.log("Updated images");

        })

    }

    const handleAmenitiesUpdate = (event, amenity) => {
        event.preventDefault()
        const newValue = event.target.checked ? amenity : null;
        console.log(newValue)
        let currAmenities = updateAmenities;
        if (newValue) {
            currAmenities.push(newValue)
            console.log("Update Amenities (Add):", currAmenities)
            setUpdateAmenities(currAmenities)
            updatePropertyDetails({amenities: currAmenities})
        } else {
            const newAmenities = currAmenities.filter(a => a!==amenity)
            console.log("Update Amenities (remove):", newAmenities)
            setUpdateAmenities(newAmenities)
            updatePropertyDetails({amenities: newAmenities})
        }

        // console.log(event.target.checked)
        // console.log(amenity)
    }

    const handleDelete = (id) => {
        setListings(listings.filter(l => l.id !== id))
    }

    const handleAddListing = (newListing) => {
        let newListings = listings;
        newListings.push(newListing)
        newListings = newListings.sort((a,b) => {
            // console.log(a,b)
            if (parseDate(a.start_dt) > parseDate(b.start_dt)) return 1;
            if (parseDate(a.start_dt) < parseDate(b.start_dt)) return -1;
            return 0;
        })
        console.log(newListings)
        setListings(newListings)
    }

    const handleEditListing = (val) => {
        if (updateLocationEdit || updateNameEdit || val) {
            setEditing(true);
        } else {
            setEditing(false);
        }
    }

    const handleDeleteProperty = () => {
        const ans = window.confirm("Are you sure you want to delete this property?")
        api.delete(`properties/${propertyid}/`, {}, headerContent.json)
            .then(res => {
                console.log(res)
                navigate(`/`)
            })
    }
    
    return (
        <>
            <div className={"property-edit-container"}>
                <div className="listing-item listing-header">
                    <div className="listing-item listing-title">
                        {updateNameEdit
                            ? <input type={"text"} value={updateName} onChange={(e) => handleTitleChange(e)}/>
                            : <h2>{updateName ?? ""}</h2>
                        }
                        <a className={editingIcon[updateNameEdit]} onClick={(e) => handleTitleEdit(e)}></a>
                    </div>
                    <div className="listing-edit-status-container">
                        <span id="listing-edit-status-label" className={"label-"+(editing ? "orange" : "green")}>{editing ? "editing" : "Saved!"}</span>
                    </div>
                    <button id="deletepropertybutton" className="fw600 fs20" onClick={() => handleDeleteProperty()}>Delete</button>
                </div>
                <div className="listing-item listing-subheader">
                    {updateLocationEdit
                        ? <input type={"text"} value={updateLocation} onChange={(e) => handleLocationChange(e)}/>
                        : <span className="listing-city-link">{updateLocation ?? ""}</span>
                    }
                    <a className={editingIcon[updateLocationEdit]} onClick={(e) => handleLocationEdit(e)}></a>
                </div>
                <div className="listing-item listing-image-gallery">
                    {
                        images.map((i, idx) => {
                            return (
                                <div key={idx} className={"list-image-container listing-image-item"+(idx===0 ? " big" : "")}>
                                    <label>
                                        <span className={editingIcon.false}/>
                                        <input type={"file"} name={"image"+(idx+1)} onChange={(e) => uploadImage(e, idx)}/>
                                    </label>
                                    <img className="listing-image-item big" src={i}/>
                                </div>
                            )
                        })
                    }

                </div>
                <div className="listing-item col2 listing-details-container-edit">
                    <div className="basic-amenities-labels-edit">
                        <h2>Details</h2>
                        <input className={"input"} type="number" value={updateGuests} onChange={(e) => handleGuestChange(e)}/>
                        <span>Guests</span>
                        <input className={"input"} type="number" value={updateBeds} onChange={(e) => handleBedChange(e)}/>
                        <span>Beds</span>
                        <input className={"input"} type="number" value={updateBaths} onChange={(e) => handleBathChange(e)}/>
                        <span>Bathrooms</span>
                    </div>
                    <div className="other-amenities-labels-edit">
                    <h2>Amenities</h2>
                    {   property &&
                        AMENITY_OPTIONS.map(a => {
                            const includes = updateAmenities.includes(a);
                            // console.log(updateAmenities)
                            // console.log(updateAmenities.includes(a))
                            return (
                                <>
                                    <input type="checkbox" checked={includes} onChange={e => handleAmenitiesUpdate(e,a)}/>
                                    <span>{a}</span>
                                </>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="listing-item col2 listing-availability-container">
                    <div className="availability-header">
                        <h3>Set Available Date Ranges</h3>
                        {/*<button className="fa-solid fa-plus" onClick={() => handleAddListing()}></button>*/}
                    </div>

                    <div className="listings-list-container">
                    <ListingRow listing={{id: -1, start_dt: '', end_dt: '', price: 0}} propertyid={propertyid} onAdd={(newListing) => handleAddListing(newListing)}/>
                    <div className="horizontal-divider"></div>
                    {listings ? listings.map(l => <ListingRow listing={l} propertyid={propertyid} onDelete={() => handleDelete(l.id)} onEdit={(val) => handleEditListing(val)}/>) : ''}
                    </div>
                </div>
            </div>
        </>
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