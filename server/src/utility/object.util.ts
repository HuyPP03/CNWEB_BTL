export const getKeyByValue = <T>(
	object: object,
	value: T,
): string | undefined => {
	return (Object.keys(object) as (keyof typeof object)[]).find((key) => {
		return object[key] == value;
	});
};

interface KeysMap {
	[key: string]: string;
}

export const renameKeysAndPush = (
	keysMap: KeysMap,
	objects: { [key: string]: any }[],
	newItem: { [key: string]: any },
): { [key: string]: any }[] =>
	objects.map((obj) =>
		Object.entries(obj).reduce(
			(acc, [key, value]) => {
				if (typeof value === 'object' && value !== null) {
					// Recursively rename keys and add new item to child objects
					return {
						...acc,
						...{
							[keysMap[key] || key]: renameKeysAndPush(
								keysMap,
								[value],
								{},
							)[0],
						},
					};
				} else {
					// Rename keys and add new item to non-object properties
					return {
						...acc,
						...{ [keysMap[key] || key]: value },
					};
				}
			},
			{ ...newItem },
		),
	);
