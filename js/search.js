function displayResults(results, store) {
  const searchResults = document.getElementById("results");
  if (results.length) {
    let resultList = "<h3 class='search-count'>" + results.length + " results found</h3>";
    // Iterate and build result list elements
    for (const n in results) {
      const item = store[results[n].ref];
      resultList +=
        '<li><a href="' + item.url + '">' + item.title + "</a>";
      resultList += "<span class='search-extract'>" + item.content.substring(0, 100) + "...</span></li>";
    }
    searchResults.innerHTML = resultList;
  } else {
    searchResults.innerHTML = "No results found.";
  }
}

function trimmerEnKo(token){
    return token
	.replace(/^[^\w가-힣]+/, '')
	.replace(/[^\w가-힣]+$/, '');
};
// Get the query parameter(s)
const params = new URLSearchParams(window.location.search);
const query = params.get("query");

// Perform a search if there is a query
if (query) {
  // Retain the search input in the form when displaying results
    document.getElementById("search-input").setAttribute("value", query);

    // // Korean tokenizer
    // var koTokenizer = function (obj) {
    // 	if (!arguments.length || obj === null || obj === undefined)
    // 	    return [];
    // 	if (Array.isArray(obj))
    // 	    return obj.map(function (t) { return t.toLowerCase(); });
    // 	return obj.toString().trim().toLowerCase().split(/[\s\-]+/);
    // };

    // // Korean stemmer
    // var koStemmer = function (token) {
    // 	return token.update(function () {
    // 	    this.pipeline.reset();
    // 	    this.pipeline.add(lunr.trimmer, lunr.stopWordFilter, lunr.stemmer);
    // 	});
    // };    

    
    var idx = lunr(function () {
	
	this.ref("id");
	this.field("title", {
	    boost: 15,
	});
	this.field("tags");
	this.field("content", {
	    boost: 10,
	});
	// // Configure tokenizer and stemmer
	// this.tokenizer(koTokenizer);
	// this.pipeline.add(koStemmer);	
	
	// this.use(lunr.ko); // 한국어 분석기 사용	
	for (const key in window.store) {
	    this.add({
		id: key,
		title: window.store[key].title,
		tags: window.store[key].category,
		content: window.store[key].content,
	    });
	}
    });

    
  // const idx = lunr(function () {
    // this.ref("id");
    // this.field("title", {
    //   boost: 15,
    // });
    // this.field("tags");
    // this.field("content", {
    //   boost: 10,
    // });

  //   for (const key in window.store) {
  //     this.add({
  //       id: key,
  //       title: window.store[key].title,
  //       tags: window.store[key].category,
  //       content: window.store[key].content,
  //     });
  //   }
  // });

  // Perform the search
  const results = idx.search(query);
  // Update the list with results
  displayResults(results, window.store);
}

// const searchResults = document.getElementById("results");

// function displayResults(results, store) {
//     var container = document.querySelector(".container");
//     if (results.length)
//     {
// 	let resultList = "<h3 class='search-count'>" + results.length + " results found</h3>";
// 	// Iterate and build result list elements
// 	for (const n in results) {
// 	    const item = store[results[n].ref];
// 	    resultList +=
// 		'<li><a href="' + item.url + '">' + item.title + "</a>";
// 	    resultList += "<span class='search-extract'>" + item.content.substring(0, 100) + "...</span></li>";
// 	}
// 	innerHTML = resultList;
//     }
//     else
//     {
// 	innerHTML = "No results found.";
//     }
// }

// function searchQuery(query){
//     const idx = lunr(function () {
// 	this.ref("id");
// 	this.field("title", {
// 	    boost: 15,
// 	});
// 	this.field("tags");
// 	this.field("content", {
// 	    boost: 10,
// 	});

// 	for (const key in window.store) {
// 	    this.add({
// 		id: key,
// 		title: window.store[key].title,
// 		tags: window.store[key].category,
// 		content: window.store[key].content,
// 	    });
// 	}
//     });
     
//     // Perform the search
//     const results = idx.search(query);
//     // Update the list with results
//     displayResults(results, window.store);
// }

// // document.addEventListener('click', (event) => {
// //     // execute search when search button click
// //     if(event.target.value == 'search'){
// // 	var query = document.getElementById('search-input');
// // 	var queryValue = query.value.trim(); // 검색어 입력값 가져오기	
// // 	if(queryValue !==""){
// // 	    alert("query value");
// // 	    searchQuery(queryValue);
// // 	}else{
// // 	    alert("no data");
// // 	}
// //     }
// // });

// //     // execute search when search button click
// // // var query = document.getElementById('search-input');
// // // var queryValue = query.value.trim(); // 검색어 입력값 가져오기
// // // const searchResults = document.getElementById("results");
// // // if(queryValue !==""){
// // //     alert("data")
// // //     searchQuery(queryValue);    
// // // }else{
// // //     searchResults.innerText="no data";
// // // }
 
