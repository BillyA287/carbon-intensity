import React,{useEffect, useState}  from 'react'

import graphStyle from './graph.style.css'


import {Bar} from 'react-chartjs-2'
import LoadingSpinner from '../loading-spinner/loading-spinner.component'
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";




const GraphInfo = () => {
    
// const [forecast, setForecast]= useState(null);    
// const [actual, setActual]= useState(null); 
const [loading, setLoading]= useState(true)

const [startError, setStartError] = useState(false);
const [endError, setEndError]= useState(false)

const [start, setStart] = useState(
  moment().subtract(7, "days").format("YYYY-MM-DD")
);
const [end, setEnd] = useState(moment().format("YYYY-MM-DD"));
const [data, setData]= useState({})

 


    
 useEffect(()=>{
   getIntensity()
console.log('j')
 },[])

 

  async function getIntensity(){
    console.log('hh')
    fetch(`https://api.carbonintensity.org.uk/intensity/${start}/${end}`)
  .then(function (res) {
      
    return res.json();
  })
  .then(function (body) {
  setLoading(false);
   
   console.log(body)

const date1 = moment(start).format("LLLL");
const date2 = moment(end).format("LLLL");

const forecast =(body.data[0].intensity.forecast);
const actual= (body.data[0].intensity.actual);
setEnd("")
setStart("")

console.log(forecast, actual)
const graphData = {
  labels: [date1 + " to " + date2],
  parsing: false,
  datasets: [
    {
      label: "Forecast",
      data: [forecast, actual],
      backgroundColor: ["rgba(44, 130, 201, 1)"],
      borderColor: ["rgba(44, 130, 201, 1)"],
      borderWidth: 5,
    },
    
    {
      label: "Actual",
      data: [actual],

      backgroundColor: ["rgba(42, 187, 155, 1)"],
      borderColor: ["rgba(42, 187, 155, 1)"],
      borderWidth: 5,
    },
    
  ],
};

   console.log(start, end, graphData)

     

     setData(graphData)
     
  }); 
 
  
} 






const submitVals = (e) => {
    e.preventDefault();

    const validateStart = new RegExp(/^\d{4}-\d{2}-\d{2}$/).test(start);
    const validateEnd = new RegExp(/^\d{4}-\d{2}-\d{2}$/).test(end);

    if (!validateStart){
      setStartError(true)
      setStart("Please input date in YYYY-MM-DD format");
      return
        
        
    }

    if (!validateEnd){
        setEndError(true);
        setEnd("Please input date in YYYY-MM-DD format");
        return
    }
    console.log(validateStart + validateEnd)
      
    
    getIntensity()
   
     



}
console.log(data)
    return (
      <div className="container">
        <div className="title">
          <h1>National Grid</h1>
        </div>

        <div className="chart">
          {loading ? <LoadingSpinner /> : <Bar data={data} />}

          <div className="user-input-section">
            <p>
              Select a start date and end date in the boxes below in the format
              YYYY-MM-DD. Data is retrieved in UTC time and is displayed in the
              graph above. Only 14 days of data can be processed at a time. Data
              cannot be shown between years. Data is only available after
              2017-09-26.
            </p>


             <form>
              <label>
                Start
                <input
                  required
                  value={start}
                  className={ startError ? "error": "" }
                  name="start"
                  type="text"
                  onChange={(e) => setStart(e.target.value)}
                  
                />
              </label>
              <label>
                End
                <input
                 required
                 value={end}
                  name="end"
                  type="text"
                  className={ endError ? "error": "" }
                  onChange={(e) => setEnd(e.target.value)}
                  
                />
              </label>
            </form> 
                <button onClick={submitVals}>Submit</button>
           
          </div>
        </div>
      </div>
    );
}

export default GraphInfo

