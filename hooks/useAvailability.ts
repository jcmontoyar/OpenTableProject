import {useState} from "react"
import axios from "axios"
export default function useAvailabilities(){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [data, setData] = useState<[{time:string, available: boolean}] | null>(null)

    const fetchAvailabilities = async ({slug, partySize, day, time}:{slug:string, partySize:string, day:string, time:string})=>{
    
      
        
        setLoading(true)
        try {
            const response = await axios.get(`http://localhost:3000/api/restaurant/${slug}/availability`,{
                params:{
                    day,
                    partySize,
                    time
                }
            })
            setLoading(false)
            setData(response.data)
            console.log(response.data)
        } catch (error:any) {
            setLoading(false)
            setData(null)
            setError(error.response.data.errorMessage)
        }
    }
    return {loading, data, error, fetchAvailabilities}
}