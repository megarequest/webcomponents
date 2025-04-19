defineComponent('drop-main', ({html, self, effect}) => {

	let value = null;

	const open = () => self.classList.add('--open');
	const close = () => self.classList.remove('--open');
	const toggle = () => self.classList.toggle('--open');

	const setValue = (value) => {
		const trigger = self.querySelector('.drop-trigger [data-value]')
		if(trigger?.innerText) trigger.innerText = value;
	}

	const handleClick = event => {

		const target = event.target;
		const isSelf = target?.closest('.drop') == self;
		if(!isSelf) return close();

		const isTrigger = target?.closest('.drop-trigger');
		if(isTrigger) {
			toggle();
			return ;
		}

		const isItem = target?.closest('.drop-item');
		if(isItem){
			setValue(isItem.innerText)
			if(isItem.dataset?.close != 'false') return close();
			return;
		}


		if(!isItem || !isTrigger) return close();
	}


	effect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    });



	return () => html`<slot></slot>`
})

