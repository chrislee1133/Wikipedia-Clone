//function for event listener
 async function handleSubmit(event) {
   //prevent page from reloading when form is submitted
   event.preventDefault();
   //gets the value of the input <fieldset>
     const inputValue = document.querySelector('.js-search-input').value;
     //removes the whitespace from the input
     const searchQuery = inputValue.trim();
     //print searchQuery to the console
     //console.log(searchQuery);

     //showing a loading indicator
     //lifted from TobiasAhlin.spinkit loading animations
    const searchResults = document.querySelector('.js-search-results');
      //clears previous results
      searchResults.innerHTML = '';

    const spinner = document.querySelector('.js-spinner');
    spinner.classList.remove('hidden');   //before invoking searchWikipedia, hidden class is removed from spinner allowing the loading animation listed earlier to be visible


     try{
       const results = await searchWikipedia(searchQuery);

        //displays when query yields no results
       if(results.query.searchinfo.totalhits === 0){
         alert('No results found. Try different keywords');
         return;
       }
       // console.log(results);
       displayResults(results);
     }
     catch (err) {
       console.log(err);
       alert('Failed to search wikipedia'); //if keyword is entered in the search input , query will be sent to wikipedia API, object returned will be logged to the console
     }
     finally {
       spinner.classList.add('hidden');  //adds hidden class back to spinner to hide loading animation
     }
 }

 //An AJAX request is a request made by an AJAX application. Typically, it is an HTTP request made by (browser-resident) Javascript that uses XML to encode the request data and/or response data
 //format=json specifies json response
 //origin=* gets around CORS restrictions
 //srlimit=20 specifies how many results should be returned per page
 //srsearch= contains search query



 async function searchWikipedia(searchQuery) {

   //searchQuery gets interpolated into the API endpoint string as &srsearch query
   const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;

   //endpoint variable gets passed as parameter to fetch
   const response = await fetch(endpoint);


   if(!response.ok) {
     throw Error(response.statusText);
   }

   //waits for the promise to resolve, await can only be used in an async function (always returns a promise)
   const json = await response.json();  //if fetch resolves to 200 ok, used to parse the response as json, error thrown otherwise
   return json;
 }

 //Displays the results
 function displayResults(results) {
   //gets a reference to the '.js-search-results' element
   const searchResults = document.querySelector('.js-search-results');


   //iterate over the search array, each nested object in the array can be accessed through the result parameter
   results.query.search.forEach(result => {
     const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

     //append the search result to the DOM
     searchResults.insertAdjacentHTML(
     'beforeend',
     `<div class="result-item">
       <h3 class="result-title">
         <a href="${url}" target="_blank" rel="noopener">${result.title}</a>
       </h3>
       <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
       <span class="result-snippet">${result.snippet}</span><br>
     </div>`
   );
 });
}

//captures/accesses the search query on form submission
 //listens for the submit even on .js-search-form and captures user input
const form = document.querySelector('.js-search-form'); //grabs a reference to an element in the DOM using querySelector, returns the first element that matches the specified selector given
form.addEventListener('submit', handleSubmit); //submit it DOM event to listen for, handleSubmit is the function ran on event trigger
