let rendered_pages = [];

function unStackPages(column) {
  let container = document.querySelector(".container");
  let children = Array.prototype.slice.call(container.children);


  for (let i = column; i < children.length; i++) {
    container.removeChild(children[i]);
  }
  rendered_pages = rendered_pages.slice(0, column);
}

function renderPageWhenClick(href, column){
    // if (rendered_pages.indexOf(href) > -1){
    // 	alert("이미 보여진 page에요");
    // 	return;
    // }    
    column = Number(column) || rendered_pages.length;
    // alert("현재 page의 column은?");
    // alert(column);
    const request = new Request(href);
     fetch(request)
	.then((response) => response.text())
	.then((text) => {
	    let container = document.querySelector(".container");
	    let fragment = document.createElement("template");
	    fragment.innerHTML = text;
	    let element = fragment.content.querySelector(".page");
	    
	    unStackPages(column)
	    container.appendChild(element);	    
	    element.dataset.column = column + 1;
	    rendered_pages.push(href);	    
	    addLinksToHandlerFromPage(element,element.dataset.column)

	})
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
	    }
	}});
};
window.onload = function () {
    rendered_pages.push(window.location.pathname);
    page = document.querySelector(".page");
    page.dataset.column = rendered_pages.length;
    column = page.dataset.column;
    addLinksToHandlerFromPage(page,column);
};
