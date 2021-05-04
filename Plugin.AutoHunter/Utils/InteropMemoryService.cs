using HunterPie.Memory;
using Plugin.AutoHunter.CheatEngine;

namespace Plugin.AutoHunter.Utils
{
    public class InteropMemoryService
    {
        private readonly CeTableParser ceTableParser;

        public InteropMemoryService(CeTableParser ceTableParser)
        {
            this.ceTableParser = ceTableParser;
        }

        public int ReadEntryInt(string entryName) => Kernel.Read<int>(this.ceTableParser.GetAddress(entryName));
        
        public int ReadMultilevelInt(long address, int[] offsets) => Kernel.Read<int>(Kernel.ReadMultilevelPtr(Address.GetAddress("BASE") + address, offsets));
        
        public int ReadInt(long address) => Kernel.Read<int>(Address.GetAddress("BASE") + address);
        
        public byte[] ReadBytes(long address, int[] offsets, int count)
        {
            var addr = Kernel.ReadMultilevelPtr(Address.GetAddress("BASE") + address, offsets);
            return Kernel.ReadStructure<byte>(addr, count);
        }

        
        public bool WriteEntryBytes(string entryName, byte[] bytes)
        {
            var address = this.ceTableParser.GetAddress(entryName);
            return Kernel.Write(address, bytes);
        }
        
        public bool WriteBytes(long address, int[] offsets, byte[] bytes)
        {
            return Kernel.Write(Kernel.ReadMultilevelPtr(Address.GetAddress("BASE") + address, offsets), bytes);
        }
    }
}