import {
    NavLink,
} from 'react-router-dom';
import {useState, useEffect, useCallback } from "react";

import api, {headerContent} from '../services/API';

import PropertyCard from './Property/PropertyCard'

import './Property/styles.css'

export default function Dashboard() {


    const [pagenum, setPagenum] = useState(1)
    const [maxpage, setMaxpage] = useState(null)
    const [properties, setProperties] = useState([])

    const handleScroll = useCallback(() => {

        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
        if (bottom) {
            if (maxpage===null || pagenum <= maxpage) {
                const body = {
                    order_price: 1
                };

                api.post(`properties/list/${pagenum}/`, body, {header: headerContent.json})
                    .then(res => res.data)
                    .then(data => {
                        // console.log(data);
                        if (maxpage !== data.page_count || maxpage===null) setMaxpage(data.page_count)
                        let propcopy = [...properties, ...data.data];
                        console.log("before:", propcopy)
                        propcopy = propcopy.map(p => {
                            let update = {...p};
                            update['thumbnail'] = p.images ? p.images.length>0 ? p.images[0][1] : null : null;
                            // delete update['images']
                            return update
                        })
                        console.log("after:", propcopy)
                        setProperties([...propcopy])
                        if (data.next_page) setPagenum(data.next_page)
                    });
            }
        }
    }, [pagenum]);

    useEffect(() => {
        const body = {
            order_price: 1
        };

        api.post(`properties/list/${pagenum}/`, body, {header: headerContent.json})
            .then(res => res.data)
            .then(data => {
                // console.log(data);
                if (maxpage !== data.page_count || maxpage===null) setMaxpage(data.page_count)
                let propcopy = [...properties, ...data.data];
                console.log("before:", propcopy)
                propcopy = propcopy.map(p => {
                    let update = {...p};
                    update['thumbnail'] = p.images ? p.images.length>0 ? p.images[0][1] : null : null;
                    // delete update['images']
                    return update
                })
                console.log("after:", propcopy)
                setProperties([...propcopy])
                if (data.next_page) setPagenum(data.next_page)
            });
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {
            passive: true
        })
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    },[handleScroll]);

    return (
        <div id={"property-container"} onScroll={handleScroll}>
            { properties.map(p => <PropertyCard key={"property"+(p.id)} data={p}/>) }
        </div>
    );
}




