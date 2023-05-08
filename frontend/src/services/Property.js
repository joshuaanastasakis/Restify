// TODO: Get authorized user profile

export async function getProperty(id) {
    if (!id) return null;

    let res = {
        id,
        name: "Default",
        amenities: []
    }

    const result = {
        success: true,
        data: {}
    }

    const result_error = {
        success: false,
        error: "Not allowed",
        status: 401
    }

    // TODO: Confirm user is authorized

    // TODO: fetch to get property details from ID

    switch (+id) {
        case 1:
            return {
                id,
                name: "Miami house",
                amenities: ["gym", "pool"]
            }
        case 2:
            return {
                id,
                name: "La Maison",
                amenities: ["kitchen", "BBQ"]
            }
        case 3:
            return {
                id,
                name: "Cozy Cabin",
                amenities: ["fireplace"]
            }
        case 4:
            return {
                id,
                name: "Camping Spot",
                amenities: []
            }
        default:
            break;
    }

    return res;
}