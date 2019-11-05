window.onkeyup = e => {
	if(e.keyCode === 13)
		enterProduct()
}

const deleteTab = e => {
	let tabs = document.getElementById('tabs')
	let all_value = document.getElementById('all-value')
	let all_cost = document.getElementById('all-cost')
	all_value.innerHTML = (parseInt(all_value.innerHTML.split('ш').slice(0,1)) - 1) + 'шт.'
	all_cost.innerHTML = (parseInt(all_cost.innerHTML.split('т').slice(0,1)) - parseInt(document.getElementById('cost-'+e.id).innerHTML)) + 'тг'

	for(let i = 0; i < global_items.length; i++)
		if(e.id == global_items[i].index){
			global_items.splice(i, 1)
			break
		}
	localStorage.setItem('global_items', JSON.stringify(global_items))

	tabs.removeChild(document.getElementById('tab-'+e.id))

	if(!tabs.children.length) tabs.innerHTML = `<div id="tabs-none"> У вас нет товаров</div>`
}

let redact = 0

const redactTab = e => {
	console.log(e.getAttribute('global'))
	let title = document.getElementById('title-'+e.id).innerHTML
	let cost = document.getElementById('cost-'+e.id).innerHTML
	cost = cost.split('т').slice(0,1)
	document.getElementById('side-title').value = title
	document.getElementById('side-cost').value = cost
	redact = e.id
}

const enterProduct = (tit, cos, ind) => {
	let title, cost
	if(tit) title = tit
	else title = document.getElementById('side-title')
	if(cos) cost = cos
	else cost = document.getElementById('side-cost')
	let tabs = document.getElementById('tabs')
	let all_value = document.getElementById('all-value')
	let all_cost = document.getElementById('all-cost')
	if(!tit) if(!checkInput(title, false, true)) return false
	if(!cos) if(!checkInput(cost, true, true)) return false
	if(redact){
		let tab_title = document.getElementById('title-'+redact)
		let tab_cost = document.getElementById('cost-'+redact)
		tab_title.innerHTML = title.value
		all_cost.innerHTML = (parseInt(all_cost.innerHTML.split('т').slice(0,1)) - parseInt(tab_cost.innerHTML)) + 'тг'
		all_cost.innerHTML = (parseInt(all_cost.innerHTML.split('т').slice(0,1)) + parseInt(cost.value)) + 'тг'
		tab_cost.innerHTML = cost.value + 'тг'

		redact = 0
	}
	else{
		if(document.getElementById('tabs-none')) tabs.removeChild(document.getElementById('tabs-none'))
		let child = `
			<div class="tab" id="tab-${ind || global_index}">
				<div class="tab-head">
					<h4 class="tab-head-title" id="title-${ind || global_index}">${title.value || title}</h4>
					<div class="tab-head-func">
						<i class="fas fa-pencil-alt" onclick="redactTab(this)" id="${ind || global_index}"></i>
						<i class="fas fa-times" onclick="deleteTab(this)" id="${ind || global_index}"></i>
					</div>
				</div>
				<div class="tab-body">
					<div class="tab-body-cost" id="cost-${ind || global_index}">${cost.value || cost}тг</div>
				</div>
			</div>
		`
		tabs.innerHTML +=child
		all_value.innerHTML = (parseInt(all_value.innerHTML.split('ш').slice(0,1)) + 1) + 'шт.'
		all_cost.innerHTML = (parseInt(all_cost.innerHTML.split('т').slice(0,1)) + parseInt(cost.value || cost)) + 'тг'

		if(!tit){
			let item = {
				index: global_index,
				title: title.value,
				cost: cost.value
			}
			global_items.push(item)
			localStorage.setItem('global_items', JSON.stringify(global_items))
			localStorage.setItem('global_index', global_index)
			localStorage.setItem('global_index', parseInt(localStorage.getItem('global_index')) + 1)
			global_index = localStorage.getItem('global_index')
		}
	}

	if(!tit){
		title.classList.remove('true')
		title.value = ''
	}
	if(!cos){
		cost.classList.remove('true')
		cost.value = ''
	} 
}

const checkInput = (e, number, code) => {
	let value = e.value
	if(number){
		if(isNaN(value) || !parseInt(value)){
			e.classList.remove('true')
			e.classList.add('false')
			if(code) return false
		}else{ 
			e.classList.remove('false')
			e.classList.add('true')
			if(code) return true
		}

	}else{
		if(value.length < 5){
			e.classList.remove('true')
			e.classList.add('false')
			if(code) return false
		}else{
			e.classList.remove('false')
			e.classList.add('true')
			if(code) return true
		}
	}
}

const allDelete = () =>{
	let tabs = document.getElementById('tabs')
	tabs.innerHTML = `<div id="tabs-none"> У вас нет товаров</div>`
	localStorage.setItem('global_items', JSON.stringify([]))
	localStorage.setItem('global_index', 1)

	let all_value = document.getElementById('all-value')
	let all_cost = document.getElementById('all-cost')

	all_value.innerHTML = '0шт.'
	all_cost.innerHTML = '0тг'

	global_items = JSON.parse(localStorage.getItem('global_items'))
	global_index = localStorage.getItem('global_index')
}

let global_index = localStorage.getItem('global_index')

if(!global_index){
	localStorage.setItem('global_items', JSON.stringify([]))
	localStorage.setItem('global_index', 0)
	global_index = 1
}
let global_items = JSON.parse(localStorage.getItem('global_items'))


setTimeout(()=>{
for(let i = 0; i < global_items.length; i++)
	enterProduct(global_items[i].title, global_items[i].cost, global_items[i].index)
},100)
