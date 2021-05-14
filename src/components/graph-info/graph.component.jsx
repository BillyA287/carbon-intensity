import React,{useEffect, useState}  from 'react'
import {Formik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import graphStyle from './graph.style.css'


import {Bar} from 'react-chartjs-2'
import LoadingSpinner from '../loading-spinner/loading-spinner.component'
import moment from "moment";




const GraphInfo = () => {

    

const [loading, setLoading]= useState(true);
const [errorMessage, setErrorMessage] = useState("")

const [start, setStart] = useState(
  moment().subtract(7, "days").format("YYYY-MM-DD")
);
const [end, setEnd] = useState(moment().format("YYYY-MM-DD"));
const [data, setData]= useState({})




  //Api call wrapped in use effect to only render when the value changes   
 useEffect(() => {

  

   async function getIntensity() {
       const date1 = moment(start).format("LLLL");
         const date2 = moment(end).format("LLLL");

         // try catch block to handle any potenital errors which may happen
     try{
       let res = await axios.get(`https://api.carbonintensity.org.uk/intensity/${start}/${end}`)
    
        
         const body = res.data;
         setLoading(false);
         
         const forecast = body.data[0].intensity.forecast;
         const actual = body.data[0].intensity.actual;

        
         const graphData = {
           labels: [date1 + " to " + date2],
           parsing: false,
           responsive: true,
           
           datasets: [
             {
               label: "Forecast",
               data: [forecast],
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

         setData(graphData);
     // if there is an error conditionally render the message to the user in error div 
     } catch (err){
    
      setLoading(false)
      setErrorMessage(err.response.data.error.message);
        

     }
   
   }

   getIntensity();
 }, [end, start]);


// validation to check that both input values match the regex
const validationSchema = Yup.object().shape({
  start: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/).required(),
  end: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/).required(),
});






    return (
      <div className="container">
      
        <div className="title">
          <h1 className="text">National Grid</h1>
          <p className="text">
            The carbon intensity of electricity is a measure of how much CO2
            emissions are produced per kilowatt hour of electricity consumed.
          </p>
          <p className="text">
            The 'actual' value (green line) is the estimated carbon intensity
            from metered generation. The 'forecast' value (blue line) is our
            forecast. The carbon intensity of electricity is sensitive to small
            changes in carbon-intensive generation. Carbon intensity varies by
            hour, day, and season due to changes in electricity demand, low
            carbon generation (wind, solar, hydro, nuclear, biomass) and
            conventional generation.
          </p>
        </div>

  {errorMessage.length > 0 && <div className="error">{errorMessage}</div>}

        <div className="chart" >
          {loading ? <LoadingSpinner /> : <Bar data={data} />}

          <div className="user-input-section">
            <p className="text">
              Select a start date and end date in the boxes below in the format
              YYYY-MM-DD. Data is retrieved in UTC time and is displayed in the
              graph above. Only 14 days of data can be processed at a time. Data
              cannot be shown between years. Data is only available after
              2017-09-26.
            </p>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                end,
                start,
              }}
              onSubmit={(values) => console.log(values)}
            >
              {({
                values,
                touched,
                handleSubmit,

                errors,
                handleBlur,
                handleChange,
              }) => (
                <form onSubmit={handleSubmit}>
                  <label>
                    <h2 className="text">Start</h2>

                    <input
                      required
                      value={values.start}
                      name="start"
                      type="date"
                      onChange={(e) => {
                        handleChange(e);
                        setStart(e.target.value);
                      }}
                      onBlur={handleBlur}
                    />
                    {touched.start && errors.start && (
                      <div className="error">{errors.start}</div>
                    )}
                  </label>

                  <label>
                    <h2 className="text">End</h2>

                    <input
                      required
                      value={values.end}
                      name="end"
                      type="date"
                      onChange={(e) => {
                        handleChange(e);
                        setEnd(e.target.value);
                      }}
                      onBlur={handleBlur}
                    />
                    {touched.end && errors.end && (
                      <div className="error">{errors.end}</div>
                    )}
                  </label>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
}

export default GraphInfo

