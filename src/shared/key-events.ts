export function createKeyEvent(which) {
	return function(node, callback) {
		function handleKeydown(event) {
			if (event.which === which) callback(event);
		}

		node.addEventListener('keydown', handleKeydown);

		return {
			destroy() {
				node.removeEventListener('keydown', handleKeydown);
			}
		};
	};
}

export const enter = createKeyEvent(13);
export const escape = createKeyEvent(27);