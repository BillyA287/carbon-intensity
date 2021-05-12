import React,{useEffect, useState}  from 'react'
import {Formik} from "formik";
import * as Yup from "yup";
import graphStyle from './graph.style.css'


import {Bar} from 'react-chartjs-2'
import LoadingSpinner from '../loading-spinner/loading-spinner.component'
import moment from "moment";




const GraphInfo = () => {

    

const [loading, setLoading]= useState(true)

const [start, setStart] = useState(
  moment().subtract(7, "days").format("YYYY-MM-DD")
);
const [end, setEnd] = useState(moment().format("YYYY-MM-DD"));
const [data, setData]= useState({})



    
 useEffect(() => {

   async function getIntensity() {
       const date1 = moment(start).format("LLLL");
         const date2 = moment(end).format("LLLL");
     try{
        fetch(`https://api.carbonintensity.org.uk/intensity/${start}/${end}`)
       .then(function (res) {
         return res.json();
       })
       .then(function (body) {
         setLoading(false);

       

         const forecast = body.data[0].intensity.forecast;
         const actual = body.data[0].intensity.actual;

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

         setData(graphData);
       }); 
     } catch (err){
      alert(err)
     }
   
   }

   getIntensity();
 }, [end, start]);



const validationSchema = Yup.object().shape({
  start: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/).required(),
  end: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/).required(),
});





console.log('')
    return (
      <div className="container">
        <div className="title">
          <h1>National Grid</h1>
        </div>

        <div className="chart">
          {loading ? <LoadingSpinner /> : <Bar  data={data} className="bar-graph" />}

          <div className="user-input-section">
            <p>
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
                  <h2>
                    Start
                  </h2>
                    
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
                  <h2>
                    End
                  </h2>
                    
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

