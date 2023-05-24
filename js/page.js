let rendered_pages = [];
var savedContent = '';
// restore_url = false;
// collaping header click시 unfold
// var collapsedTitle = document.querySelector(".permalink");
// if(collapsedTitle){
//     alert('permalink: ' +collapsedTitle.innerText);
// }else{
//     alert("collapsed title");
//     collapsedTitle.addEventListener('click', titleClickHandler);
// }
// function titleClickHandler(event) {
//     alert("clickeed");
//     const title = event.target.innerText;
//     unfoldHead(title);
// }

document.addEventListener('click', (event) => {
    var container = document.querySelector(".container");
    parent = event.target.parentElement;
    if(event.target.className == 'collapsed-title'){
	const title = event.target.innerText;
	unfoldHead(title);	
	// alert("collapsed button click");
    }
    // execute search when search button click
    if(event.target.value == 'search'){
	var query = document.getElementById('search-input');
	var queryValue = query.value.trim(); // 검색어 입력값 가져오기	
	if(queryValue !==""){
	    // alert("contents exists");
	    container.innerHTML = ''; // 기존 컨테이너 내용물 제거	    
	    searchQuery(queryValue);
	}else{
	    // alert("no contents");
	}
    }

    
    // single page mode when clicking page title
    if(parent.getAttribute("data-singlepage")=='yes')
    {
    }
    // d3 mode when clicking d3 switch
    if(event.target.role == 'switch'){

	if(!event.target.checked)
	{
	    header = document.getElementsByTagName("header");
	    swithcheader = header.item(0).getElementsByTagName("span");
	    swithcheader.item(3).innerText = "d3 off"	    
	    // alert("switch off");
	    container.innerHTML = savedContent;
	}
	else
	{
	    header = document.getElementsByTagName("header");
	    swithcheader = header.item(0).getElementsByTagName("span");
	    swithcheader.item(3).innerText = "d3 on"
	    savedContent=container.innerHTML;	    
	    container.innerHTML = ''; // 기존 컨테이너 내용물 제거

	    drawRect();
	    // drawVisual();
	}
    }
});

function drawRect()
{

    var svg = d3.select('.container')
	.append('svg')
	.attr('width', '100%')
	.attr('height', '100%');
    svg.append('rect')
	.attr('x', 50)
	.attr('y', 50)
	.attr('width', 200)
	.attr('height', 100)
	.attr('fill', 'steelblue');
}
function drawVisual()
{
    //document.getElementById('myMSG').innerHTML = "last name"+localStorage.lastname;
    /*var getArr = [];
    getArr = JSON.parse(localStorage.getItem('storeArray'));
    document.getElementById('myMSG').innerHTML = getArr[1].parentURL;*/


    var w = 1024, h = 768;

    // var w=window.innerWidth
    // || document.documentElement.clientWidth
    // || document.body.clientWidth;

    // var h=window.innerHeight
    // || document.documentElement.clientHeight
    // || document.body.clientHeight;
    //var w = 1024, h = 768;

    //var vis = d3.select("#tab_5_contents").append("svg:svg").attr("width", w).attr("height", h);
    var vis = d3.select(".container").append("svg:svg").attr("width", w).attr("height", h);

            var QueuedORG = [];
            //QueuedORG = JSON.parse(localStorage.getItem('storeArray'));
            QueuedORG.push({url: "Root", parentURL: "Root", used:0});
            QueuedORG.push({url: "a", parentURL: "Root", used:0});
            QueuedORG.push({url: "b", parentURL: "Root", used:0});
            QueuedORG.push({url: "c", parentURL: "Root", used:0});
            QueuedORG.push({url: "d", parentURL: "Root", used:0});
            QueuedORG.push({url: "e", parentURL: "a", used:0});
            QueuedORG.push({url: "f", parentURL: "a", used:0});
            QueuedORG.push({url: "g", parentURL: "a", used:0});
            QueuedORG.push({url: "h", parentURL: "a", used:0});
            QueuedORG.push({url: "p", parentURL: "b", used:0});
            QueuedORG.push({url: "q", parentURL: "b", used:0});
            QueuedORG.push({url: "r", parentURL: "b", used:0});
            QueuedORG.push({url: "x", parentURL: "c", used:0});
            QueuedORG.push({url: "y", parentURL: "x", used:0});
            QueuedORG.push({url: "y", parentURL: "c", used:0});
            QueuedORG.push({url: "x", parentURL: "a"});
            QueuedORG.push({url: "y", parentURL: "b"});


            var nodes = [];

            var labelAnchors = [];
            var labelAnchorLinks = [];
            var links = [];

            for(var i = 0; i < QueuedORG.length; i++) 
            {
                var nodeExists = 0;

                //check to see if a node for the current url has already been created. If yes, do not create a new node
                for(var j = 0; j < nodes.length; j++)  
                {
                    if(QueuedORG[i].url == nodes[j].label)
                        nodeExists = 1;

                }

                if (nodeExists == 0)
                {
                    var urlLabel = QueuedORG[i].url;
                    //remove 'http://' part
                    /*urlLabel = urlLabel.split("http://")[1];
                    if(urlLabel.match("www"))
                    urlLabel = urlLabel.split("www.")[1];
                    var rest = urlLabel.split("\.")[1];
                    urlLabel = urlLabel.split("\.")[0];*/

                    var node = {
                        label : QueuedORG[i].url,
                        category : QueuedORG[i].category
                    };
                    nodes.push(node);
                    labelAnchors.push({
                        node : node
                    });
                    labelAnchors.push({
                        node : node
                    });
                }
            };

            for(var i=0;i<nodes.length; i++)
            {
                console.log("node i:"+i+nodes[i]+"\n");
                console.log("labelAnchor i:"+i+labelAnchors[i]+"\n");
            }

            //To create links for connecting nodes
            for(var i = 0; i < QueuedORG.length; i++) 
            {
                var srcIndx = 0, tgtIndx = 0;
                for(var j = 0; j < nodes.length; j++)
                {
                    if( QueuedORG[i].url == nodes[j].label ) //to find the node number for the current url
                    {
                        srcIndx = j;
                    }

                    if( QueuedORG[i].parentURL == nodes[j].label ) //to find the node number for the parent url
                    {
                        tgtIndx = j;
                    }
                }
                //console.log("src:"+srcIndx+" tgt:"+tgtIndx);

                //connecting the current url's node to the parent url's node
                links.push({
                    source : srcIndx,
                    target : tgtIndx,
                    weight : 1,
                });

                labelAnchorLinks.push({
                    source : srcIndx * 2,
                    target : srcIndx * 2 + 1,
                    weight : 1
                });
            };

            var force = d3.layout.force().size([w, h]).nodes(nodes).links(links).gravity(1).charge(-10000).linkStrength(function(x) {
                return x.weight * 10                                            // charge is for inter-node repel, link distance is node-node distance 
            });
            force.linkDistance(function(d) {
                return d.weight * 100;
            });

            force.start();

            var force2 = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkStrength(10).charge(-500).size([w, h]);   //charge is for inter-label repel, link distance is node-label distance
            force2.linkDistance(function(d) {
                return d.weight * 10;
            });

            force2.start();

            var link = vis.selectAll("line.link").data(links).enter().append("svg:line").attr("class", "link").style("stroke", "#CCC");

            var colors = {"1": "black", "2": "blue", "3": "red"};           // 1=root node 2=blog nodes 3=.org nodes
            var shape = {"1": "diamond", "2": "cross", "3": "circle"};

            var node = vis.selectAll("g.node").data(force.nodes()).enter().append("path").attr("class", "node").call(force.drag);
        //node.append("circle").attr("r", 5).style("stroke", "#FFF").style("stroke-width", 3).attr("class", function(d) {return "node category"+d.category});

            node.attr("d", d3.svg.symbol().type(function(d) {return shape[d.category];})).style("stroke", "#FFF").style("fill", function(d){ return colors[d.category];});

            var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks)//.enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

            var anchorNode = vis.selectAll("g.anchorNode").data(force2.nodes()).enter().append("svg:g").attr("class", "anchorNode");
            anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
            anchorNode.append("svg:text").text(function(d, i) {
                return i % 2 == 0 ? "" : d.node.label
            }).style("fill", "#555").style("font-family", "Arial").style("font-size", 12);

            var updateLink = function() {
                this.attr("x1", function(d) {
                    return d.source.x;
                }).attr("y1", function(d) {
                    return d.source.y;
                }).attr("x2", function(d) {
                    return d.target.x;
                }).attr("y2", function(d) {
                    return d.target.y;
                });
            }

            var updateNode = function() {
                this.attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            }

            force.on("tick", function() {

                force2.start();

                node.call(updateNode);

                anchorNode.each(function(d, i) {
                    if(i % 2 == 0) {
                        d.x = d.node.x;
                        d.y = d.node.y;
                    } else {
                        var b = this.childNodes[1].getBBox();

                        var diffX = d.x - d.node.x;
                        var diffY = d.y - d.node.y;

                        var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                        var shiftX = b.width * (diffX - dist) / (dist * 2);
                        shiftX = Math.max(-b.width, Math.min(0, shiftX));
                        var shiftY = 5;
                        this.childNodes[1].setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
                    }
                });

                anchorNode.call(updateNode);

        link.call(updateLink);
        anchorLink.call(updateLink);

    });
}

window.addEventListener("popstate", function (event) {
    // alert("popstate handler:  " + event.state.page);

    var goalUrl = event.state.page;
    var goal_url = new URI(goalUrl);
    var g_searchParams = goal_url.search(true);
    var goalValues = g_searchParams.stackedPages;
    var goalParamsArray = goalValues.split(",");

    if(rendered_pages.length > goalParamsArray.length){
	s = rendered_pages.pop();
	let container = document.querySelector(".container");
	container.removeChild(container.lastChild);
    }else if(rendered_pages.length < goalParamsArray.length){
	goalpage = goalParamsArray.pop();
	fetchPage(goalpage,rendered_pages.length);
    }else{
	// alert("[handler] replace");
	r=rendered_pages.pop();	
	goalpage = goalParamsArray.pop();	
	let container = document.querySelector(".container");
	container.removeChild(container.lastChild);		
	fetchPage(goalpage,rendered_pages.length);	
    }
    
    updateCollapsedState();

});

// function createURL(href){
//     rendered_pages.push(href);
//     const query = new URLSearchParams(window.location.search);
//     v= rendered_pages.slice(1, rendered_pages.length)
//     query.set("stackedPages", v);
//     const uri = window.location.origin + window.location.pathname + '?' + query.toString();

// }
// function pushURLHistoryStack(uri){
//     state = { page: uri };
//     window.history.pushState(state, "", uri);
// }

function pushPageToHistoryStack(flag){
    const query = new URLSearchParams(window.location.search);
    // alert("query: " + query);
    v= rendered_pages.slice(0, rendered_pages.length)
    query.set("stackedPages", v);
    const uri = window.location.origin + window.location.pathname + '?' + query.toString();

    state = { page: uri };
    if(flag){
	// alert("[replace stack]: " + uri);	
	window.history.replaceState(state, "", uri);	
    }
    else{
	// alert("[push stack]: " + uri);		
	window.history.pushState(state, "", uri);
    }
}
function updateHistoryStack(){
    
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

function removePages(start_column,last_column){
    let container = document.querySelector(".container");
    delete_pages = last_column - start_column;

    // alert('delete_pages: ' + delete_pages)
    for (let i = 0; i < delete_pages; i++) {
	container.removeChild(container.lastChild);
	rendered_pages.pop();	
    }
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
 // data-column값에 맞춰 page를 삽입한다.
function insertPage(page, href){
    container = document.querySelector(".container");
    children_array = Array.prototype.slice.call(container.children);    
    children = container.querySelectorAll(".page");

    var columnValue = page.dataset.column;
    var insertIndex = 0;
    
    for (var i = 0; i < children_array.length; i++) {
	var currentColumnValue = parseInt(children[i].getAttribute("data-column"));
	if (columnValue < currentColumnValue) {
	    break;
	}
	insertIndex++;
    }
    
    if (insertIndex === children_array.length) {
	container.appendChild(page);
	rendered_pages.push(href);
    } else {
	var nextSibling = children_array[insertIndex];
	container.insertBefore(page, nextSibling);
	rendered_pages.splice(insertIndex,0,href);
    }    
}
function checkStackHistory(){
    var historyLength = history.length;
    var historyEntries = [];

    for (var i = 0; i < historyLength; i++) {
	historyEntries.push(history.state);
	// historyEntries.push(history[i].url);	
	// history.go(-1); // 이전 항목으로 이동하여 historyEntries에 저장
    }

    for (var j = historyLength - 1; j >= 0; j--) {
	// history.go(1); // 다시 원래 위치로 이동
    }

    // alert("History Stack 개수: " + historyLength + "\n\n" + "History Entries:\n" + JSON.stringify(historyEntries));
    
}
// 모든 page는 0부터 시작, href를 인자로 받는 이유는
// rendered_pages관리를 위해서, unstack을 renderPage에서 호출하기
// 때문이다. unstack을 fetch에서 수행하면 UI가 흔들림.
function renderPage(page,page_column,href){
    container = document.querySelector(".container");
    page_column = Number(page_column);
    new_page_column = page_column + 1;
    page.dataset.column = new_page_column;
    replace_flag = false;
    target_column = '[data-column="' + new_page_column +'"]';
    const targetElement = container.querySelector(target_column);
    if (targetElement){
	// alert("새로고침 or 중간 page에서 render page 호출");
	// alert("붙일  page의 위치(data-column): " + new_page_column);
	
	var targetTitle = targetElement.querySelector(".collapsed-title");
	var targetText = targetTitle.textContent;
	// alert("이미 있는 targettext: " + targetText);

	var pageTitle = page.querySelector(".collapsed-title");
	var pageText = pageTitle.textContent;
	// alert("붙일 pagetext: "+pageText);	
	
	if(pageText == targetText){
	    // alert("똑같습니다. replace가 필요없습니다.");
	    // alert("새로고침했기 때문에 rendered_page는 []이고 history update,link처리가 안되어 있어서 처리가 필요합니다.");

	    addHandlerLinksFromPage(targetElement,new_page_column);
	    // checkHistory();
	    // replace_flag = true;
	    rendered_pages.push(href);	    
	    pushPageToHistoryStack(replace_flag);
	    updateBreadCrumbs();	    
	    // checkStackHistory();	    
	    // alert("현재 rendered_pages: " + rendered_pages);
	    // alert("완료")	    
	}
	else{
	    // alert("replace가 필요합니다.");
	    // alert("이미 있는 page를 삭제합니다.");
	    children = Array.prototype.slice.call(container.children);	    
	    removePages(page_column,children.length-1);	    
	    // alert("새로운 page 붙입니다..");
	    insertPage(page,href);
	    // alert("새로운 page를 붙였기 때문에 link처리가 필요합니다.");
	    addHandlerLinksFromPage(page,new_page_column);	
	    // alert("rendered_page,history update가 필요합니다.");
	    // checkStackHistory();
	    replace_flag = true; 
	    pushPageToHistoryStack(replace_flag);
	    updateBreadCrumbs()
	    // checkStackHistory();
	    // alert("현재 rendered_pages: " + rendered_pages);	    
	    // alert("완료")
	}

	// alert("자식의 수: " + children.length +"rendered Pages: " + rendered_pages);
	// container.removeChild(targetElement);
	// rendered_pages.pop();
	// children = Array.prototype.slice.call(container.children);
	// alert("삭제후");
	// alert("자식의 수: " + children.length +"rendered Pages: " + rendered_pages);

	// removePages(page_column,children.length-1);
	// insertPage(page);	
	// replace_flag =true;
	// pushPageToHistoryStack(href,replace_flag);		
    }else{
	// alert("정상적인 page 붙이기");
	insertPage(page,href);
	pushPageToHistoryStack(replace_flag);
	// checkStackHistory();
	updateCollapsedState();
	addHandlerLinksFromPage(page,new_page_column);	
	updateBreadCrumbs();
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
    var currentState = history.state;
    history.replaceState(currentState, null, null);
    if (stackedPages) {
	// alert("onload 새로고침-stack");
	// restore_url = true;
	// history.replaceState(null, null, location.href);
	// history.pushState(null, null, location.href);
	// alert('rendered_pages: ' +rendered_pages);
	const stacks = stackedPages.split(',');
	if (!Array.isArray(stacks)) 
	    stacks = [stacks];
	// alert("onload 붙일 page 개수: " + stacks.length);
	for (let i = 0; i < stacks.length; i++) {
	    // alert("복구페이지: " + stacks[i] + '복구 위치: ' + i);
	    // rendered_pages.push(stacks[i]);
	    if(i ==0){
		// alert("onload 0번째 page처리");
		page = document.querySelector(".page");
		page.dataset.column = 0;
		fetchPage(stacks[i], -1);		
	    }else{
		// alert("onload " + i + " 번째 page 처리 ");
		fetchPage(stacks[i], i-1);
	    }
	}
    }
    else{
	// alert("onload 새로고침-normal")
	// restore_url = false;
	// rendered_pages.push(window.location.pathname);    
	page = document.querySelector(".page");
	title = page.querySelector(".collapsed-title");
	// alert("title: " + title.innerText);
	page.dataset.column = 0;
	rendered_pages.push(window.location.pathname);
	// alert("rendered_pages" + rendered_pages);	

	// checkStackHistory();
	if(title.innerText == 'Root Page'){
	    // alert("this is root page");
	    pushPageToHistoryStack(false);	    
	    addHandlerLinksFromPage(page,page.dataset.column);
	}else{
	    // page.classList.remove("page");
	    page.classList.add("newPage");
	    // var firstChild = page.querySelector('.content').firstElementChild;
	    // if (firstChild.tagName === 'A') {
	    // 	firstChild.removeAttribute('href');
	    // 	firstChild.onclick = function(event) {
	    // 	    event.preventDefault();
	    // 	};
	    // }	    
	}
    }
};

