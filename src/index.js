
const quotesUrl = `http://localhost:3000/quotes`
const quoteUlEl = document.querySelector('#quote-list')
const formEl = document.querySelector('#new-quote-form')
const bodyEl = document.querySelector('body')
const quoteEl = document.querySelector('#new-quote')
const authorEl = document.querySelector('#author')

function getQuotes(){
  return fetch(quotesUrl)
    .then(resp => resp.json())
      .then(quotesData => state.quotes = quotesData)
        .then(() => renderQuotes())
}

state = {
  quotes: []
}


const renderQuote = (quote) => {
  const liEl = document.createElement('li')
  liEl.className='quote-card'
  liEl.innerHTML =`
  <blockquote class="blockquote">
  <p class='mb-0'>${quote.quote}</p>
  <footer class="blockquote-footer">${quote.author}</footer>
  <button data-id=${quote.id} class='btn btn-success'>Likes:<span>${quote.likes}</span></button>
  <button data-id=${quote.id} class ='btn btn-danger'>Delete</button>
  </blockquote>
  `
  liEl.addEventListener("click", likeQuote)
  liEl.addEventListener("click", deleteQuote)
  quoteUlEl.append(liEl)
}

const renderQuotes = () => {
  state.quotes.forEach(quote => renderQuote(quote))
}


const likeQuote = (event) => {
  if (event.target.classList.contains('btn-success')){
    const buttonId = event.target.dataset.id
      selectedQuote = state.quotes.find(quote => quote.id == buttonId)
        selectedQuote.likes++
        theRightButton = document.querySelector(`[data-id="${buttonId}"]`)
        theRightButton.innerHTML = `Likes: ${selectedQuote.likes}`
        likesToDB(selectedQuote)
      }
  }

  document.addEventListener("submit", event => {
    event.preventDefault()

    const quote = {
      quote: quoteEl.value,
      likes: 0,
      author: authorEl.value
    }

    state.quotes.push(quote)
    formEl.reset()
    quoteUlEl.innerHTML = ""
    createQuote(quote)
  })

  function createQuote(quote){
      return fetch(`http://localhost:3000/quotes`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(quote)
      }).then(() => getQuotes())
  }


  const deleteQuote = event => {
    if (event.target.classList.contains('btn-danger')){
    const buttonId = event.target.dataset.id
    selectedQuote = state.quotes.find(quote => quote.id == buttonId)
    deleteInDb(selectedQuote)
  }
}

  function deleteInDb(selectedQuote){
    return fetch(`http://localhost:3000/quotes/${selectedQuote.id}`,{
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    }).then(() => {
        quoteUlEl.innerHTML = ""
        getQuotes()
    })
}


  function likesToDB(selectedQuote){
    return fetch(`http://localhost:3000/quotes/${selectedQuote.id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(selectedQuote)
      })
    }

getQuotes()
