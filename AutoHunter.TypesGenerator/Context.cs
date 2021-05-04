using System;
using System.Collections.Generic;

namespace AutoHunter.TypesGenerator
{
    public class Context
    {
        public Dictionary<string, string> Types { get; set; } = new();
        public Dictionary<string, string> Events { get; set; } = new();
        public Dictionary<string, string> Consts { get; set; } = new();

        public HashSet<Type> SkipTypes { get; set; } = new();
    }
}