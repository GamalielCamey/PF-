import axios from "axios"

export function getReviews(email){
    return async function(dispatch){
        let res = await axios.get(`https://flymatepf.herokuapp.com/api/comments/userComments/${email}`)
        dispatch({
            type: "GET_REVIEW",
            payload: res.data
        })
    }
}

export function postReview(body) {
    return async function(dispatch) {
        try {    
            var res = await axios.post(`https://flymatepf.herokuapp.com/api/comments/addComment`, body);
            return dispatch({
                type: 'POST_REVIEW',
                payload: res.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}