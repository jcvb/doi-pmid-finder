const doiRegex = require("doi-regex");
const Set = require("core-js/actual/set");
const fetch = require("cross-fetch");

async function doiPmidFinder(string, config) {
  let data = {};
  let newPmidList = [];
  let restOfString = "";

  const type = config != undefined  ? config.type : "multiple";

  if (string === undefined || string === "") {
    throw new Error("Your string is empty");
  }

  const doiList = string.match(doiRegex());
  restOfString = doiList != null ? removeDoiListFromString(string, doiList) : string;
  
  const numberList = extractNumberFromString(restOfString);
  const newDoiList = [...new Set(string.match(doiRegex()))];
  
  if (!isNaN(numberList[0])) {
    const pmidResponse = await validatePmidList([...new Set(numberList)]);
    const response = await pmidResponse.json();
    newPmidList = cleanPmidResponse(
      response.eSummaryResult.DocumentSummarySet.DocumentSummary
    );
  }

  if (type == "single") {
    data = returnSingleResult(newDoiList, newPmidList, string);
  } else {
    data = {
      doiList: newDoiList,
      pmidList: newPmidList,
    };
  }

  return data;
}

function returnSingleResult(doiList, pmidList, string) {
  const firstDoi = doiList.length > 0 ? true : false;
  const firstPmid = pmidList.length > 0 ? true : false;
  if (!firstDoi && !firstPmid) {
    return "We did not find any doi or pmid";
  } else if (firstDoi && !firstPmid) {
    return doiList[0];
  } else if (!firstDoi && firstPmid) {
    return pmidList[0];
  } else {
    const indexDoi = string.indexOf(doiList[0]);
    const indexPmid = string.indexOf(pmidList[0]);
    const firstResult = indexDoi < indexPmid ? doiList[0] : pmidList[0];
    return firstResult;
  }
}

function removeDoiListFromString(string, doiList) {
  let newString = string;
  doiList.forEach((doi) => (newString = newString.replace(doi, "")));
  return newString;
}

function extractNumberFromString(string) {
  return string
    .replace(/\D+/g, " ")
    .trim()
    .split(" ")
    .map((e) => parseInt(e));
}

function cleanPmidResponse(pmidResponse) {
  const pmidArray =
    typeof pmidResponse === "object" ? [pmidResponse] : pmidResponse;
  let newList = [];
  pmidArray.forEach((pmidItem) => {
    if (!pmidItem.error) {
      newList.push(pmidItem.uid);
    }
  });
  return newList;
}

function validatePmidList(pmidList) {
  return fetch(
    `https://proxy-api-168602.appspot.com/https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmidList.join(
      ","
    )}&version=2.0`
  );
}

module.exports = doiPmidFinder;