defineComponent('drop-input', ({html, self}) => {
	let element = null;
	setTimeout(() => {
		self.addEventListener('dropdown:open', () => self.classList.add('--open'))
		self.addEventListener('dropdown:close', () => self.classList.remove('--open'))
		self.addEventListener('dropdown:toggle', () => self.classList.toggle('--open'))
	}, 2)

	return () => html`<slot></slot>`
})

defineComponent('drop-trigger', ({html, self}) => {
	let element = null;
	const onclick = () => element.parentElement.dispatchEvent(new Event('dropdown:toggle'));
	setTimeout(() => element = self, 2)
	return () => html`
		<button type="button" onclick="${onclick}"><slot></slot></button>
	`
})

defineComponent('drop-container', ({html, self}) => {
	setTimeout(() => {
		self.addEventListener('dropdown:open', () => self.parentElement.dispatchEvent(new Event('dropdown:open')));
		self.addEventListener('dropdown:close', () => self.parentElement.dispatchEvent(new Event('dropdown:close')));
		self.addEventListener('dropdown:toggle', () => self.parentElement.dispatchEvent(new Event('dropdown:toggle')));
	}, 2)
	return () => html`<slot></slot>`;
})

defineComponent('drop-content', ({html, self}) => {
	setTimeout(() => {
		self.addEventListener('dropdown:open', () => self.parentElement.dispatchEvent(new Event('dropdown:open')));
		self.addEventListener('dropdown:close', () => self.parentElement.dispatchEvent(new Event('dropdown:close')));
		self.addEventListener('dropdown:toggle', () => self.parentElement.dispatchEvent(new Event('dropdown:toggle')));
	}, 2)
	return () => html`<slot></slot>`;
})

defineComponent('drop-item', ({html, self}) => {
	setTimeout(() => {
		self.addEventListener('click', () => self.parentElement.dispatchEvent(new Event('dropdown:close')));
	}, 2)
	return () => html`<slot></slot>`;
})