import React,{useEffect, useState}  from 'react'
import TextField from "@material-ui/core/TextField";

import graphStyle from './graph.style.css'


import {Bar} from 'react-chartjs-2'
import LoadingSpinner from '../loading-spinner/loading-spinner.component'
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import FilledInput from "@material-ui/core/FilledInput";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));



const GraphInfo = () => {
    
const [forecast, setForecast]= useState(null);    
const [actual, setActual]= useState(null); 
const [loading, setLoading]= useState(true)
const [start, setStart] = useState('');
const [end, setEnd]= useState('');


 const classes = useStyles();


    
  async function getIntensity(){
    fetch(`https://api.carbonintensity.org.uk/intensity/${start}/${end}`)
  .then(function (res) {
      
    return res.json();
  })
  .then(function (body) {
  setLoading(false);
   
   
     setForecast(body.data[0].intensity.forecast);
     setActual(body.data[0].intensity.actual);
  }); 
 
  
} 

const date1 = moment(start).format('LLLL');
const date2 = moment(end).format("LLLL");

const data = {
  labels: [date1 +' to ' + date2],
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





const submitVals = (e) => {
    e.preventDefault();

    const validateStart = new RegExp(/^\d{4}-\d{2}-\d{2}$/).test(start);
    const validateEnd = new RegExp(/^\d{4}-\d{2}-\d{2}$/).test(end);

    if (!validateStart){
        return alert('h')
    }

    if (!validateEnd){
        return alert('j')
    }
    console.log(validateStart + validateEnd)
      const timeFrame = {
        start: validateStart,
        end: validateEnd,
      };

     


 setTimeout(function () {

   getIntensity(); 
   
   
 },);

}

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

            {/* <form className={classes.root} noValidate autoComplete="off">
              <FormControl>
                <InputLabel htmlFor="component-simple">Start</InputLabel>
                <Input
                  id="component-simple"
                  value={start}
                  onChange={(e) =>setStart(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="component-helper">End</InputLabel>
                <Input
                  id="component-helper"
                  value={end}
                  onChange={(e)=>setEnd(e.target.value)}
                  aria-describedby="component-helper-text"
                /> */}

             <form>
              <label>
                Start
                <input
                  required
                  name="start"
                  type="text"
                  onChange={(e) => setStart(e.target.value)}
                  
                />
              </label>
              <label>
                End
                <input
                 required
                  name="end"
                  type="text"
                  onChange={(e) => setEnd(e.target.value)}
                  
                />
              </label>
            </form> 
                <button onClick={submitVals}>Submit</button>
              {/* </FormControl>
            </form> */}
          </div>
        </div>
      </div>
    );
}

export default GraphInfo

