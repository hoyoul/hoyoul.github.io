let rendered_pages = [];
restore_url = false;

// collaping header click시 unfold
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('collapsed-title')) {
	const title = event.target.innerText;
	unfoldHead(title);
    }
    
});

window.addEventListener("popstate", function (event) {
    // alert("popstate event");
    var goalUrl = window.location.href;
    // const cquery = new URLSearchParams(url);
    // const dquery = new URLSearchParams(previousUrl);
    var goal_url = new URI(goalUrl);
    var g_searchParams = goal_url.search(true);
    var goalValues = g_searchParams.stackedPages;
    var goalParamsArray = goalValues.split(",");
    // alert("goal 배열 길이: " + goalParamsArray.length);
    // for(i=0;i<goalParamsArray.length;i++){
    // 	alert(goalParamsArray[i]);
    // }

    // alert("rendered_pages: " + rendered_pages);
    // alert("rendered_pages 배열 길이: " + rendered_pages.length);
    // for(i=0;i<rendered_pages.length;i++){
    // 	alert(rendered_pages[i]);
    // }

    if(rendered_pages.length > goalParamsArray.length){
	// alert("back 버튼 눌렀을때");
	s = rendered_pages.pop();
	// alert(s + "제거");
	
	let container = document.querySelector(".container");
	container.removeChild(container.lastChild);	
	// children = Array.prototype.slice.call(container.children);
	
    }else if(rendered_pages.length < goalParamsArray.length){
	// alert("이전 page가 더 많을때");
	s = goalParamsArray.pop();
	fetchPage(s,rendered_pages.length);
    }else{
	// alert("replace");
	// rendered_pages.pop();
	s = goalParamsArray.pop();	
	let container = document.querySelector(".container");
	container.removeChild(container.lastChild);		
	fetchPage(s,rendered_pages.length);	
    }
    
    updateCollapsedState();
    
    // for (var key in c_searchParams) {
    // 	if (c_searchParams.hasOwnProperty(key)) {
    // 	    var value = c_searchParams[key];
    // 	    alert("current Parameter: " + key + ", Value: " + value);
    // 	}
    // }
    // for (var key in h_searchParams) {
    // 	if (h_searchParams.hasOwnProperty(key)) {
    // 	    var value = h_searchParams[key];
    // 	    alert("stack Parameter: " + key + ", Value: " + value);
    // 	}
    // }


    // if(event.state){
	// len = event.state.pages.length;
	// unstackPages(0, len,event.state.pages[0]);
	// for(i=1;i<len;i++){
	//     alert(event.state.pages[i]);
	//     fetch(event.state.pages[i],i-1);
	// }
	// uri = URI(event.state.page);
	
	// alert("꺼낸 url: " + uri);
	// window.location = uri;
	// window.location = window.location; // this reloads the page.	
    // }
});

function createURL(href){
    rendered_pages.push(href);
    const query = new URLSearchParams(window.location.search);
    v= rendered_pages.slice(1, rendered_pages.length)
    query.set("stackedPages", v);
    const uri = window.location.origin + window.location.pathname + '?' + query.toString();

}
function pushURLHistoryStack(uri){
    state = { page: uri };
    window.history.pushState(state, "", uri);
}

function pushPageToHistoryStack(href){

    rendered_pages.push(href);
    // old_pages = rendered_pages.slice(0, column+1);
    // state = { pages: old_pages, column: column };
    // window.history.pushState(state, "", href);
    const query = new URLSearchParams(window.location.search);
    v= rendered_pages.slice(0, rendered_pages.length)
    // alert('rendered_page값: ' +v);
    query.set("stackedPages", v);
    const uri = window.location.origin + window.location.pathname + '?' + query.toString();
    // uri.setQuery("stackPages", href);
    // alert("생성한 uri: " + uri);
    // alert('history: ' + uri);
    state = { page: uri };
    window.history.pushState(state, "", uri);
}

function unfoldHead(title){
    const pages = document.querySelectorAll('.page');
    for (let i = 0; i < pages.length; i++) {
	const h1Elements = pages[i].querySelectorAll('h1');
	for (let j = 0; j < h1Elements.length; j++) {
	    if (h1Elements[j].innerText === title) {
		pages[i].classList.remove("collapsed");
	    }
	}
    }
}

function updateCollapsedState(){
    let pages = document.querySelectorAll('.page');
    // 모든  page들이 collapsing되어 있으면, 마지막 header를 unfold한다.
    var allDivsCollapsed = true;
    pages.forEach(function(page) {
	if (!page.classList.contains("collapsed")) {
	    allDivsCollapsed = false;
	    return;
	}
    });
    if(allDivsCollapsed){
	// alert("모든 page들이 collapsing되었다.");
	let lastPage = pages.item(pages.length - 1);
	lastPage.classList.remove("collapsed");
	
    }
    
    // page가 3개이상일때,
    if (pages.length > 3){
	attachCollapsingHeader();
    }
}
// scroll 화면에 3개 이상의 page가 있을때 앞에 page들을 collapsing
function attachCollapsingHeader(){
    let pages = document.querySelectorAll('.page');
    for (i=0; i< pages.length; i++){
	if (i < pages.length - 3){
	    pages[i].classList.add("collapsed");
	}
    }
}


// rendered_pages를 유지하는 이유는 visited link를 위해서임.
function updateBreadCrumbs() {
    links = Array.prototype.slice.call(document.querySelectorAll("a"));
    links.forEach(function (e) {
      if (rendered_pages.indexOf(e.getAttribute("href")) > -1) {
	  if (e.getAttribute("href") != "/"){
	      e.classList.add("active");
	  }
      }
      else {
	  e.classList.remove("active");
      }	
    });
}

function removePages(page_column,last_child,href){
    let container = document.querySelector(".container");
    total_remove_child = last_child - page_column;

    for (let i = 0; i < total_remove_child; i++) {
	container.removeChild(container.lastChild);
	// container.lastChild.classList.remove("page");
	// container.lastChild.classList.add("pagenil");	
    }
    // rendered_pages = rendered_pages.slice(0, page_column+1);
    rendered_pages.pop();

}
function sortingPages(){
    // alert("sorting pages");
    var container = document.querySelector('.container');
    var pages = Array.from(container.querySelectorAll('.page'));

    // data-column 값에 따라 페이지 정렬
    pages.sort(function(a, b) {
        var columnA = parseInt(a.getAttribute('data-column'));
        var columnB = parseInt(b.getAttribute('data-column'));
        return columnA - columnB;
    });

    // 정렬된 페이지를 다시 container에 추가
    pages.forEach(function(page) {
        container.appendChild(page);
    });    
}
// 모든 page는 0부터 시작, href를 인자로 받는 이유는
// rendered_pages관리를 위해서, unstack을 renderPage에서 호출하기
// 때문이다. unstack을 fetch에서 수행하면 UI가 흔들림.
function renderPage(page,page_column,href){
    container = document.querySelector(".container");
    page_column = Number(page_column);
    new_page_column = page_column + 1;
    page.dataset.column = new_page_column;            
    // 새로고침시 처리
    if(restore_url){
	// alert("새로고침 render pages");
	target_column = '[data-column="' + new_page_column +'"]';
	const targetElement = container.querySelector(target_column);
	if (targetElement){
	    // alert("container에 column이 있습니다");
	}
	else{
	    // alert("container에 해당 column이 없습니다"+ target_column);
	    container.appendChild(page);
	}	
	sortingPages();
	updateCollapsedState();
	addHandlerLinksFromPage(page,new_page_column);	
    }
    else{
	children = Array.prototype.slice.call(container.children);
	last_child_page = children.length-1;
	if (page_column < last_child_page){    
	    removePages(page_column,last_child_page,href);	
	}
	container.appendChild(page);	
	pushPageToHistoryStack(href);
	updateBreadCrumbs();
	// page.scrollIntoview({behavior: "smooth"});
	// attachCollapsingHeader()
	updateCollapsedState();	
	addHandlerLinksFromPage(page,new_page_column);
    }
}

function fetchPage(href,page_column){
    const request = new Request(href);
    fetch(request)
	.then((response) => response.text())
	.then((text) => {
	    let fragment = document.createElement("template");
	    fragment.innerHTML = text;
	    let page = fragment.content.querySelector(".page");
	    renderPage(page,page_column,href);
	});
}

function addHandlerLinksFromPage(page,page_column) {
    links = Array.prototype.slice.call(page.querySelectorAll("a"));
    links.forEach(function (atag) {
	var HrefValue = atag.getAttribute("href");
	if (HrefValue)
 	{
	    if (!(
		HrefValue.indexOf("http://") === 0 ||
		HrefValue.indexOf("https://") === 0 ||
		HrefValue.indexOf("mailto:") === 0 ||
		HrefValue.indexOf("#") === 0 ||
		HrefValue.includes(".pdf") ||
		HrefValue.includes(".svg")
	    ))
	    {
		atag.dataset.column = page_column;
		atag.addEventListener("click", function (e) {
		    if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			fetchPage(HrefValue,this.dataset.column);
		    }
		});
	    }
	}});
};

window.onload = function () {
    const query = new URLSearchParams(window.location.search);
    const stackedPages = query.get('stackedPages');

    if (stackedPages) {
	// alert("새로고침");
	restore_url = true;

	// alert('rendered_pages: ' +rendered_pages);
	const stacks = stackedPages.split(',');
	if (!Array.isArray(stacks)) 
	    stacks = [stacks];
	// alert(stacks);
	for (let i = 0; i < stacks.length; i++) {
	    // alert("복구페이지: " + stacks[i] + '복구 위치: ' + i);
	    rendered_pages.push(stacks[i]);
	    if(i ==0){
		page = document.querySelector(".page");
		page.dataset.column = 0;
		fetchPage(stacks[i], -1);		
	    }else{
		fetchPage(stacks[i], i-1);
	    }
	}
    }
    else{
	restore_url = false;
	// rendered_pages.push(window.location.pathname);    
	page = document.querySelector(".page");
	page.dataset.column = 0;
	pushPageToHistoryStack(window.location.pathname);
	addHandlerLinksFromPage(page,page.dataset.column);
    }
};
