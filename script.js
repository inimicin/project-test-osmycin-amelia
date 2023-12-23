let text = document.getElementById("text1");
let navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  let value = window.scrollY;

  if(window.scrollY < window.innerHeight){
    text.style.marginTop = value * 2.5 + "px";
  }
});

const nav = document.querySelector(".navbar-container");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (window.scrollY == 0) {
    nav.classList.remove("nav--hidden");
    nav.classList.remove("nav--trans");
  } else {
    if (lastScrollY < window.scrollY) {
      nav.classList.add("nav--hidden");
    } else {
      nav.classList.add("nav--trans");
      nav.classList.remove("nav--hidden");
    }
  }

  lastScrollY = window.scrollY;
});

function get_content_by_url(urls) {
  $.ajax({
    url: urls,
    headers: {
        'Accept': 'application/json'
    },
    type: "GET", /* or type:"GET" or type:"PUT" */
    dataType: "json",
    data: {
    },
    success: function (result) {
      console.log(urls);

      datas = result['data'];
      links = result['links'];
      metas = result['meta'];

      localStorage.setItem('pageNumber', metas['current_page']);

      var tempData = '';
      var tempLink = `
        <li><a onclick="get_content_by_url('${links['first']}')" id="first-item"><i class="bi bi-chevron-double-left"></i></a></li>
        <li><a onclick="get_content_by_url('${links['prev']}')" id="back-item"><i class="bi bi-chevron-compact-left"></i></a></li>
      `;

      datas.forEach(data => {
        // console.log(data['small_image'][0]['id']);
        // console.log(data['small_image'][0]['url']);
        // console.log(data['small_image'][0]);
        tempData = tempData.concat(`
        <div class="card" style="width: 15rem">
          <div class="img-container">
            <img
              src="${data['small_image'][0] ? data['small_image'][0]['url'] : ''}"
            />
          </div>
          <div class="card-body">
            <p class="card-date">${data['published_at']}</p>
            <p class="card-text">${data['title']}</p>
          </div>
        </div>`);
      });

      metas['links'].slice(1, -1).forEach(link => {
        tempLink = tempLink.concat(`
          <li><a ${link['active'] ? 'class="active"' : ''} onclick="get_content_by_url('${link['url']}')">${link['label']}</a></li>
        `)
      })

      
      tempLink = tempLink.concat(`
        <li><a onclick="get_content_by_url('${links['next']}')" id="next-item"><i class="bi bi-chevron-right"></i></a></li>
        <li><a onclick="get_content_by_url('${links['last']}')" id="last-item"><i class="bi bi-chevron-double-right"></i></a></li>
      `)

      $('#content-container').html(tempData);
      $('#order-list').html(tempLink);
      $('#label-post').html(`Showing ${metas['from']}-${metas['to']} of ${metas['total']}`);
      // console.log();
    },
    error: function () {
        console.log("error");
    }
  });
}

function get_content(pageNumber, pageSize, sortMethod) {
  const urls = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${pageNumber}&page[size]=${pageSize}&append[]=small_image&sort=${sortMethod}`;
  
  localStorage.setItem('pageNumber', pageNumber);
  localStorage.setItem('pageSize', pageSize);
  localStorage.setItem('sortMethod', sortMethod);

  get_content_by_url(urls);
}

function get_current_content() {
  if (localStorage.getItem('pageNumber') && localStorage.getItem('pageSize') && localStorage.getItem('sortMethod')) {
    pageNumber = localStorage.getItem('pageNumber');
    pageSize = localStorage.getItem('pageSize');
    sortMethod = localStorage.getItem('sortMethod');

    $("#size_selector").val(pageSize);
    $("#sort_selector").val(sortMethod);

    get_content(pageNumber, pageSize, sortMethod);
  } else {
    $("#size_selector").val(10);
    $("#sort_selector").val("-published_at");

    get_content(1, 10, "-published_at");
  }
}

function change_page_size(pageSize) {
    sortMethod = localStorage.getItem('sortMethod');

    get_content(1, pageSize, sortMethod);
}

function change_sort_method(sortMethod) {
    pageSize = localStorage.getItem('pageSize');

    get_content(1, pageSize, sortMethod);
}

function change_background(urls) {
  console.log(urls);
  $('.banner-container').css('background', `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
      url(${urls})`);
  $('.banner-container').css('background-size', 'cover');
}
