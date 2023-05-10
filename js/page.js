let rendered_pages = [];

// const element = document.querySelector(".container");
// element.addEventListener("scroll", onScrollWidthChanged);

// function onScrollWidthChanged(event) {
//     const scrollWidth = event.target.scrollWidth;
//     alert("scrollWidth changed to " + scrollWidth);
// }
// const container = document.querySelector('container');

// container.addEventListener('click', function(event) {
// if (event.target.classList.contains('collapsed-title')) {
//       const children = Array.from(event.target.parentNode.children);
//       const index = children.indexOf(event.target);
//       alert(`Clicked on child ${index + 1}`);
//     }    
// });

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

function computeLayout(){
    let pages = document.querySelectorAll('.page');
    for (i=0; i< pages.length; i++){
	if (i < pages.length - 3){
	    pages[i].classList.add("collapsed");
	}
    }
}

function updateCollapsedState(col) {
    
    let container = document.querySelector('.container');    
    let pages = document.querySelectorAll('.page');
    let scroll_width = container.scrollWidth;


    for (let i = 0; i < pages.length; i++) {
	let normal_page_width = (i+1)* (pages[i].offsetWidth);
	let normal_page_left = i* (pages[i].offsetWidth);	
	let page_left = pages[i].offsetLeft;
	// alert(i + "page/" + (pages.length-1) +
	//       " [normal_page_width]: " + normal_page_width
	//       + " [scroll_width]: " + scroll_width);
	if ( normal_page_left < page_left) {
		pages[i].classList.add("collapsed");
	}else{
	    pages[i].classList.remove("collapsed");
	}
	// if (normal_page_left < (page_left ) ) {
	//     pages[i].classList.add("collapsing");
	// } else {
	//     pages[i].classList.remove("collapsing");
	// }
    }
    
    // for (let i = 0; i < pages.length; i++) {
    // 	let normal_page_left = i* (pages[i].offsetWidth);
    // 	let page_left = pages[i].offsetLeft;

    // 	alert(i +"번째 page의 " + "normal_page_left: " + normal_page_left + "page_left: " + page_left);
    // 	// alert("column is :" + (column));
    // 	// alert("last is : " + (last_page));
    // 	if((page_left - normal_page_left) > 4 ){
    // 	    pages[i].classList.add("collapsed");

    // 	}
    // }
}


function unStackPages(column) {
  let container = document.querySelector(".container");
  let children = Array.prototype.slice.call(container.children);

    numberOfRemove = children.length - column;
    for (let i = 0; i < numberOfRemove; i++) {
	container.removeChild(container.lastChild);
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
	    let children = Array.prototype.slice.call(container.children);
	    let last_child = children.length;

	    if(column != last_child){
		unStackPages(column);
		container.appendChild(element);
		// container.classList.add("nooverflow");
		
	    }else{
		
		container.appendChild(element);
		computeLayout();
		// updateCollapsedState(column);
		element.scrollIntoView({behavior: "smooth"});		
	    }
	    // const pages = container.querySelectorAll('.page');
	    setTimeout(
		function(element,column){
		    element.dataset.column = column + 1;
		    rendered_pages.push(href);	    
		    addLinksToHandlerFromPage(element,element.dataset.column);
		    updateBreadCrums();	    	    		    
		    // element.scrollIntoView({behavior: "smooth"});
	
		    // updateCollapsedState(column);	    		    
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
    // updateCollapsedState();	        
    addLinksToHandlerFromPage(page,column);
};
