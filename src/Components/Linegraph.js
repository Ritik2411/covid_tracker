import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'
import './Linegraph.css'

function Linegraph({caseType,...props}) {
    const [data,setData] = useState({})

    const options = {
        legend:{
            display:false
        },
        elements:{
            point:{
                radius:0
            }
        },
        maintainAspectRatio: false,
        tooltips:{
            mode: "index",
            intersect: false,
            callbacks: {
                label: function(tooltipItem, data){
                    return numeral(tooltipItem.value).format("+0,0")
                }
            }
        },
        scales:{
            xAxes:[{
                type:"time",
                time: {
                    format: "MM/DD/YYYY",
                    tooltipformat: "ll"
                }
            }],

            yAxes:[{
                gridlines:{
                    display: false
                },
                ticks:{
                    callbacks: function(value,index,values){
                        return numeral(value).format("0a")
                    }
                }
            }]
        }
    }


    const buildChartData = (data, caseType='cases') => {
        const chartData = []
        let lastdatapoint
 
         for(let date in data.cases) {
             if(lastdatapoint){
                 const newDataPoint = {
                     x:date,
                     y:data[caseType][date] - lastdatapoint
                 }
                 chartData.push(newDataPoint)
             }
             lastdatapoint = data[caseType][date]
         };
 
         return chartData
     }

    useEffect(()=>{
        axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=120").then((data)=>{
            console.log(data.data)
            const chartData = buildChartData(data.data,caseType)
            setData(chartData)
        }).catch((err)=>{
            console.log(err)
        })
    },[caseType])

    return (
        <div className="linegraph_container">
           {
               (data.length>0)?(
                    <Line options={options}
                        data={{
                            datasets:[{
                                backgroundColor:"rgba(204,16,52,0.5)",
                                borderColor:"#CC1034",
                                data:data
                            }]
                        }}
                    />
                ):(null)
            }   
        </div>      
    )
}

export default Linegraph
