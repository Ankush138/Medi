import { useEffect, useState } from "react";
import "./App.css"
function App(){
  const [search,setSearch]=useState("");
  const [medicines,setMedicine]=useState([]);
  // const [loading,setLoading]=useState(false);
  const [selectedMedicine,setSelectedMedicine]=useState(null);

  
    
   

  

  const searchMedicine=async(text)=>{
    
   
    
    

    
      const value=encodeURIComponent(text);
      try{
    const response=await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${value}*&limit=20`);

    if(!response.ok){
     setMedicine([]);
      return;

    }

    const data =await response.json();

    const names=data.results
    .map((item)=>({
      name:item.openfda?.brand_name?.[0],
      generic:item.openfda?.generic_name?.[0],
      manufacturer:item.openfda?.manufacturer_name?.[0],
      data:item
    })).filter((item)=>item.name);
    setMedicine(names);
  }
  catch (error){
    console.log(error);
    setMedicine([]);
  }
 

  };

  useEffect(()=>{

    
     const timer=setTimeout(()=>{
      searchMedicine(search);
    },400);

    return()=>clearTimeout(timer);},[search]);
  
  

  return(
    <div className="page">
      <h1>Medicine Search</h1>
    
      
        <input 
        className="search-input"
        type="text" placeholder="Search for a medication (e.g. Advil,Tylenol)..."
        value={search}
        onChange={(e)=>{
          setSearch(e.target.value)
          setSelectedMedicine(null);
        }}
        
    />

          
        <div className="medicine-list">
          {
            medicines.map((medicine,index)=>(
              <div
              className="medicine-card" 
              key={index}
              onClick={()=>setSelectedMedicine(medicine.data)}
            >
              <h3>{medicine.name}</h3>
              <p>
                {medicine.generic || "Generic name not available"}
              </p>
              <p>
                {medicine.manufacturer || "Manufacturer not available"}
              </p>
              </div>
            ))
            
          }

        
      </div>

      {selectedMedicine && (
        <div className="details">
          <h2>
            {selectedMedicine.openfda?.brand_name?.[0]}
          </h2>
          <p>
            <b>Generic Name:</b>{" "}
            {
              selectedMedicine.openfda?.generic_name?.[0] || "Not available"
            }
          </p>
          <p>
            <b>Manufacturer Name:</b>{" "}
            {
              selectedMedicine.openfda?.manufacturer_name?.[0] || "Not available"
            }
          </p>
          </div>

      )}


    </div>
  );

}

export default App;