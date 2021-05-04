using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Xml.Serialization;

namespace Plugin.AutoHunter.CheatEngine
{
    public class CheatEntry
    {
        public int ID { get; set; }
        
        [XmlElement("Description")]
        public string RawDescription { get; set; }
        
        public int GroupHeader { get; set; }

        [XmlIgnore] public string Description => this.RawDescription?.Trim('"');
        
        [XmlElement("Address")] public string RawAddress { get; set; }

        [XmlIgnore] public long Address => long.Parse(this.RawAddress.Split('+').Skip(1).Take(1).First(), NumberStyles.HexNumber);

        [XmlArray("Offsets")]
        [XmlArrayItem("Offset")]
        public string[] RawOffsets
        {
            get => this.Offsets.Select(o => o.ToString("X")).Reverse().ToArray();
            set => this.Offsets = value.Select(ParseOffset).Reverse().ToArray();
        }
        
        [XmlIgnore]
        public int[] Offsets { get; set; }

        [XmlArray("CheatEntries")]
        [XmlArrayItem("CheatEntry")]
        public List<CheatEntry> CheatEntries { get; set; }

        private static int ParseOffset(string offsetString)
        {
            // add support for offsets like "c28+260"
            return offsetString.Split('+')
                .Select(s => int.Parse(s, NumberStyles.HexNumber))
                .Sum();
        }
    }
}