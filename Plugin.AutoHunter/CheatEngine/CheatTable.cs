using System.Collections.Generic;
using System.Xml.Serialization;

namespace Plugin.AutoHunter.CheatEngine
{
    public class CheatTable
    {
        [XmlArray("CheatEntries")]
        [XmlArrayItem("CheatEntry")]
        public List<CheatEntry> CheatEntries { get; set; }
    }
}