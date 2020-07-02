console.log("Hi");
const form= document.querySelector("form");
const loadingElement = document.querySelector(".loading"); //get the element with loading class
//apiurl- post req to send object to server
const API_URL = 'http://localhost:5000/news';
const newsElement=document.querySelector(".news");




loadingElement.style.display = ''; //to hide 


listAllNews();



form.addEventListener("submit", (event)=> {
    event.preventDefault();
    const formData = new FormData(form); //grab user input from page
    const name = formData.get("name");
    const content = formData.get("content");

    const ourdata = {
        name,
        content
        
    };
    console.log(ourdata);
    //hide the form and display the gif
    form.style.display = 'none';
    loadingElement.style.display="";

//after showing the gif, we send the data to backend server
//might get access denied coz the client and server ip is different
    fetch(API_URL, {
        method:'POST',
        body: JSON.stringify(ourdata),
        headers: {
            'content-type': 'application/json'
        }
    }).then (response => response.json())
    
      .then (createdData =>{
        //console.log(createdData);
        form.reset();
        setTimeout(() =>{
            form.style.display = '';
            
        }, 30000);
            

        listAllNews();
        loadingElement.style.display="none";

    });




});


function listAllNews(){
    newsElement.innerHTML='';

    fetch(API_URL)
        .then(response => response.json())
        .then(news => {
            //console.log(news)
            news.reverse();
            news.forEach(ourdata=>{
            const div = document.createElement('div');
            const header = document.createElement('h3');
            header.textContent = ourdata.name;
            const contents = document.createElement('p');
            contents.textContent = ourdata.content;
            const dates = document.createElement('small');
            dates.textContent=ourdata.created
            
            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(dates);
            newsElement.appendChild(div);
            
        })
        })
};
