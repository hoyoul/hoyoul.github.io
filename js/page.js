let rendered_pages = [];

// collaping header click시 unfold
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('collapsed-title')) {
	const title = event.target.innerText;
	unfoldHead(title);
    }
    
});

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

function unstackPages(clicked_page_column,last_child,href){
    let container = document.querySelector(".container");
    total_remove_child = last_child - clicked_page_column;

    for (let i = 0; i < total_remove_child; i++) {
	container.removeChild(container.lastChild);
	// container.lastChild.classList.remove("page");
	// container.lastChild.classList.add("pagenil");	
    }
    rendered_pages = rendered_pages.slice(0, clicked_page_column+1);

}
// 모든 page는 0부터 시작, href를 인자로 받는 이유는
// rendered_pages관리를 위해서, unstack을 renderPage에서 호출하기
// 때문이다. unstack을 fetch에서 수행하면 UI가 흔들림.
function renderPage(page,clicked_page_column,href){
    container = document.querySelector(".container");
    children = Array.prototype.slice.call(container.children);
    // the_number_of_last_child = children.length;
    last_child_page = children.length-1;
    if (clicked_page_column < last_child_page)
	unstackPages(clicked_page_column,last_child_page,href);
    rendered_pages.push(href);
    updateBreadCrumbs();            
    container.appendChild(page);
    // page.scrollIntoview({behavior: "smooth"});
    attachCollapsingHeader()	
    addHandlerLinksFromPage(page,clicked_page_column+1);	
}

function fetchPage(href,clicked_page_column){

    const request = new Request(href);
    fetch(request)
	.then((response) => response.text())
	.then((text) => {
	    let fragment = document.createElement("template");
	    fragment.innerHTML = text;
	    let page = fragment.content.querySelector(".page");
	    renderPage(page,clicked_page_column,href);
	});
}

function addHandlerLinksFromPage(page,clicked_page_column) {
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
		atag.addEventListener("click", function (e) {
		    if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			fetchPage(HrefValue,clicked_page_column);
		    }
		});
	    }
	}});
};

window.onload = function () {
    rendered_pages.push(window.location.pathname);    
    page = document.querySelector(".page");
    clicked_page_column =0;
    addHandlerLinksFromPage(page,clicked_page_column);
};
