// check user submission, call api
function handleSubmit() {

    // grab user input
    const tagged = document.getElementById('userQuery').value;

    // ensure that user has entered a search query before making api call
    if (tagged) {
        // inform user that the data is being grabbed
        informUser('Loading...')

        getData(tagged)
    }
    else {
        // inform user that a search query must be entered
        informUser('Please enter a search query')
    }

    // prevent page from refreshing on submit
    return false
}

// get data from the stack overflow api
function getData(query) {
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
            if (data.items.length === 0) {
                informUser('No items matched your search query. Try something like \'reactjs\' or \'python\'!')
            }
            else {
                generateTable(data.items)
            }
        })
}

// upon successful api call, organize data into table rows
function generateTable(items) {
    // generate table data
    let tableData = ''
    for (let i = 0; i < items.length; i++) {
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

    // remove user message, show table
    informUser('')
    document.getElementById('questionTable').style.display = 'table'
    
}

// function to update message displayed to user
function informUser(message){
    document.getElementById('userMessage').textContent = message
}