# doi-pmid-finder 


> Find and validate all Doi(s), Pmid(s) on a string, returning a array of results.


## Install

```sh
$ npm install doi-pmid-finder
```


## Usage

```js
const doiPmidFinder = require("doi-pmid-finder");

doiPmidFinder(
  "unicorn 10.1000/xyz000 10.1000/xyz000 10.1000/xyz000 10.1000/xyz000 https://onlinelibrary.wiley.com/doi/10.1111/all.14449  https://link.springer.com/article/10.1007/s10456-021-09805-6  5454454 34343 3333 12345 juan  4444 99999999999999999  0000 10.1186/s12879-021-06357-4 https://www.pnas.org/doi/full/10.1073/pnas.2203437119"
).then((response) => {
  console.log(response);
});

```


## API

### doiPmidFinder(string)

Returns a array of doi(s) and pmid(s) removing all repeated ids. The pmid are validated on ncbi API (https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi)

#### Example
```js
{
  data: {
    doiList: [
      '10.1000/xyz000',
      '10.1111/all.14449',
      '10.1007/s10456-021-09805-6',
      '10.1186/s12879-021-06357-4',
      '10.1073/pnas.2203437119'
    ],
    pmidList: [ '5454454', '34343', '3333', '12345', '4444' ]
  }
}

```