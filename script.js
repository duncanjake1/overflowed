
// const tagged = document.getElementById('queryImput').value

function handleSubmit(){

    // grab user input
    const tagged = document.getElementById('userQuery').value;
    
    // ensure that user has entered a search query before making api call
    if(tagged){
        getData(tagged)
    }
    else{
        // inform user that a search query must be entered
        console.log('please enter a search query')
    }

    // prevent page from refreshing on submit
    return false
}

function getData(query){
    // use proxy to get around CORS issues
    // proxy source: https://github.com/Rob--W/cors-anywhere.git
    const proxy = 'https://nameless-journey-40666.herokuapp.com/'
    const url = `https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&tagged=${query}&site=stackoverflow`
    
    const request = proxy + url;

    // call API
    fetch(request, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        }
    })
      .then(response => response.json())
      .then(data => {
          if(data.items.length === 0){
              console.log('No items matched your search query. Try something like \'reactjs\' or \'python\'!')
          }
          else{
              console.log(data)
              generateTable(data.items)
          }
      })
    }

    function generateTable(items){
        // generate table data
        let tableData = ''
        for(let i = 0; i < items.length; i++){
            let item = items[i]

            // convert unix time to date time
            let creationDate = new Date(0)
            creationDate.setUTCSeconds(item.creation_date)

            // add data to table in a row
            tableData += `
                <tr>
                    <td>${item.owner.display_name}</td>
                    <td><a href='${item.link}' target="_blank">${item.title}</a></td>
                    <td>${creationDate.getMonth()}/${creationDate.getDate()}/${creationDate.getFullYear()}</td>
                </tr>`
        }

        // append data to table
        document.getElementById('tableBody').innerHTML = tableData;
    }

    getData('php')