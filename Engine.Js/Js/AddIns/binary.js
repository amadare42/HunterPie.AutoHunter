
var typedArrayType = host.type('Microsoft.ClearScript.JavaScript.ITypedArray');
var uint64Type = host.type('System.UInt64');
var byteType = host.type('System.Byte');

globalThis.toByteArray = function toByteArray(tArray) {

    var bytes = host.newArr(byteType, tArray.length * tArray.BYTES_PER_ELEMENT);
    var typedArray = host.cast(typedArrayType, tArray);
    typedArray.ReadBytes(0, host.cast(uint64Type, tArray.length * tArray.BYTES_PER_ELEMENT), bytes, 0);

    return bytes;
}