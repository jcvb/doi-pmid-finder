const doiRegex = require("doi-regex");
const Set = require("core-js/actual/set");

async function doiPmidFinder(string) {
  if (string === undefined) throw new Error("Your string is empty");
  const doiList = string.match(doiRegex());
  const restOfString = removeDoiListFromString(string, doiList);
  const numberList = extractNumberFromString(restOfString);

  const pmidResponse = await validatePmidList([...new Set(numberList)]);
  const newPmidList = cleanPmidResponse(
    pmidResponse.data.eSummaryResult.DocumentSummarySet.DocumentSummary
  );
  return {
    data: {
      doiList: [...new Set(string.match(doiRegex()))],
      pmidList: newPmidList,
    },
  };
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
  let newList = [];
  pmidResponse.forEach((pmidItem) => {
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
