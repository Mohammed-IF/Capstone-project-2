const deletePostedService = (btn) => {
    const csrf = btn.parentNode.querySelector('[name=_csrf').value;
    const postedServiceId = btn.parentNode.querySelector('[name=postedServiceId').value;

    const postedServiceElement = btn.closest('article')

    fetch('/freelancer/postedService/'+postedServiceId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        console.log(result);
        return result.json();
    })
    .then(data => {
        console.log(data);
        postedServiceElement.parentNode.removeChild(postedServiceElement);
    })
    .catch(err => {
        console.log(err);
    })
}

const deletePortfolio = (btn) => {
    const csrf = btn.parentNode.querySelector('[name=_csrf').value;
    const portfolioId = btn.parentNode.querySelector('[name=portfolioId').value;

    const portfolioElement = btn.closest('article')

    fetch('/freelancer/portfolio/'+portfolioId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        console.log(result);
        return result.json();
    })
    .then(data => {
        console.log(data);
        portfolioElement.parentNode.removeChild(portfolioElement);
    })
    .catch(err => {
        console.log(err);
    })
}
