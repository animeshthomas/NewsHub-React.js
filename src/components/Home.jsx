import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Home = () => {

    const[data,changeData]=useState([])
    const fetchData=()=>{
        axios.get("https://newsapi.org/v2/top-headlines?country=in&category=general&apiKey=9b6ac262eea44bcbbf80ae1b064f631d").then(
            (response)=>{
                changeData(response.data.articles)
            }
        )
    }
    

    useEffect(()=>{fetchData()},[])



    return (
        <div>

            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 xol-xxl-12">

                        <div className="row">
                            {data.map(
                                (value,index)=>{
                                    return <div className="col col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 xol-xxl-3">
                                    <div class="card mb-3" >
                                        <div class="row g-0">
                                            <div class="col-md-4">
                                                <img src={value.urlToImage} height="20" class="img-fluid rounded-start" alt=""></img>
                                            </div>
                                            <div class="col-md-8">
                                                <div class="card-body">
                                                    <h5 class="card-title">{value.source.name}</h5>
                                                    <p class="card-text">{value.source.description}</p>
                                                    <p class="card-text">{value.author}</p>
                                                    <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                }
                            )
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home