// not technically a worker but whatever

if (!window.__findElement) {
	window.__findElement = () => {
		const finder = document.createElement('elementfinder');
		finder.style.position = 'fixed';
		// finder.style.overflow = 'hidden';
		// finder.style.textOverflow = 'ellipsis';
		finder.style.boxSizing = 'border-box';
		finder.style.backgroundColor = 'hsla(90, 50%, 80%, 0.4)';
		// finder.style.border = '1px solid hsla(90, 50%, 50%, 0.8)';
		// finder.style.borderRadius = '2px';

		const label = document.createElement('elementfinderlabel');
		label.style.position = 'absolute';
		label.style.backgroundColor = '#333';
		label.style.color = '#eee';
		label.style.borderRadius = '2px';
		label.style.padding = '2px 4px';
		label.style.whiteSpace = 'pre';
		// label.style.textShadow = '0 0 2px hsla(90, 50%, 80%, 1), 0 0 2px hsla(90, 50%, 80%, 1), 0 0 2px hsla(90, 50%, 80%, 1)';
		label.style.fontFamily = '"Fira Code", Menlo, Inconsolata, monospace';
		label.style.fontSize = '12px';
		finder.appendChild(label);

		function handleMousemove(event) {
			const element = [...document.elementsFromPoint(event.clientX, event.clientY)]
				.filter(element => element.__svelte_meta)
				.shift();

			if (element) {
				const { left, right, top, bottom } = element.getBoundingClientRect();
				finder.style.left = `${left}px`;
				finder.style.top = `${top}px`;
				finder.style.width = `${right - left}px`;
				finder.style.height = `${bottom - top}px`;

				const id = element.id ? `#${element.id}` : '';
				const classNames = element.className
					.split(' ')
					.filter(name => name && !/svelte-/.test(name))
					.map(name => `.${name}`)
					.join('');

				const { file, line, column } = element.__svelte_meta;

				if (top > 40) {
					label.style.bottom = 'auto';
					label.style.top = '-36px';
				} else if (bottom < window.innerHeight - 40) {
					label.style.top = 'auto';
					label.style.bottom = '-36px';
				} else {
					label.style.bottom = 'auto';
					label.style.top = '0';
				}

				label.innerHTML = `<strong>${element.localName}${id}${classNames}</strong>\n<span>${file} (${line}:${column})</span>`

				document.body.appendChild(finder);
			} else if (finder.parentNode) {
				finder.parentNode.removeChild(finder);
			}
		}

		function handleMousedown(event) {
			const element = [...document.elementsFromPoint(event.clientX, event.clientY)]
				.filter(element => element.__svelte_meta)
				.shift();

			if (element) {
				cancel();
				window.selectElement(element);
			}
		}

		function cancel() {
			if (finder.parentNode) {
				finder.parentNode.removeChild(finder);
			}

			window.removeEventListener('mousemove', handleMousemove, true);
			window.removeEventListener('mousedown', handleMousedown, true);
			window.removeEventListener('keydown', handleKeydown, true);
		}

		function handleKeydown(event) {
			if (event.which === 27) {
				cancel();
			}
		}

		window.addEventListener('mousemove', handleMousemove, true);
		window.addEventListener('mousedown', handleMousedown, true);
		window.addEventListener('keydown', handleKeydown, true);
	};
}

window.__findElement();