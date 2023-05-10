let rendered_pages = [];

function updateCollapsedState() {
    const pages = document.querySelectorAll('.page');
    
    for (let i = 0; i < pages.length; i++) {
	if(pages[i].offsetLeft != (i*641))
	{
	    pages[i].classList.add("collapsed");	    
	}
    }
}


function unStackPages(column) {
  let container = document.querySelector(".container");
  let children = Array.prototype.slice.call(container.children);


  for (let i = column; i < children.length; i++) {
    container.removeChild(children[i]);
  }
  rendered_pages = rendered_pages.slice(0, column);
}

function updateBreadCrums() {
  links = Array.prototype.slice.call(document.querySelectorAll("a"));
  links.forEach(function (e) {
      if (rendered_pages.indexOf(e.getAttribute("href")) > -1) {
	  if (e.getAttribute("href") != "/")
	      e.classList.add("active");
      } else {
	  e.classList.remove("active");
      }
  });
}

function renderPageWhenClick(href, column){
    column = Number(column) || rendered_pages.length;
    const request = new Request(href);
    fetch(request)
	.then((response) => response.text())
	.then((text) => {
	    let container = document.querySelector(".container");
	    let fragment = document.createElement("template");
	    fragment.innerHTML = text;
	    let element = fragment.content.querySelector(".page");
	    
	    unStackPages(column);
	    container.appendChild(element);

	    setTimeout(
		function(element,column){
		    element.dataset.column = column + 1;
		    rendered_pages.push(href);	    
		    addLinksToHandlerFromPage(element,element.dataset.column);
		    updateBreadCrums();	    	    		    
		    element.scrollIntoView({behavior: "smooth"});
		    updateCollapsedState();	    		    
		}.bind(null,element,column),
		10
	    );
	});

}

function addLinksToHandlerFromPage(page,column) {
    links = Array.prototype.slice.call(page.querySelectorAll("a"));
    links.forEach(function (element) {
	var rawHref = element.getAttribute("href");
	if (rawHref)
 	{
	    if (!(
		rawHref.indexOf("http://") === 0 ||
		rawHref.indexOf("https://") === 0 ||
		rawHref.indexOf("mailto:") === 0 ||
		rawHref.indexOf("#") === 0 ||
		rawHref.includes(".pdf") ||
		rawHref.includes(".svg")
	    ))
	    {
		element.addEventListener("click", function (e) {
		    if (!e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			renderPageWhenClick(element.getAttribute("href"),page.dataset.column)
		    }
		});
	    // updateBreadCrums();	    	    
	    }
	}});
};
window.onload = function () {
    rendered_pages.push(window.location.pathname);
    container = document.querySelector(".container");
    // alert("container's scroll width: " + container.scrollWidth);
    page = document.querySelector(".page");
    page.dataset.column = rendered_pages.length;
    column = page.dataset.column;
    updateCollapsedState();	        
    addLinksToHandlerFromPage(page,column);
};
