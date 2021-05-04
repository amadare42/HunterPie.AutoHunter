function transform(filename, script) {
    var result = Babel.transform(script, {
        presets: [
            "typescript"
        ],
        sourceMaps: 'both',
        filename
    });
    
    return {
        code: result.code,
        sourceMap: JSON.stringify(result.map)
    };
} 
