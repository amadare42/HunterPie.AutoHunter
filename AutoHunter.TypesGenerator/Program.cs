using System.Collections.Generic;
using System.IO;
using HunterPie.Core;
using HunterPie.Core.Monsters;
using HunterPie.Memory;
using Microsoft.ClearScript;
using Plugin.AutoHunter;
using Plugin.AutoHunter.Configuration;

namespace AutoHunter.TypesGenerator
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            var gen = new TypingsGenerator();
            
            gen.AddBaseTypes();

            gen.AddEvents(typeof(Game), "Game");
            gen.AddEvents(typeof(Player), "Player");
            
            gen.AddType(typeof(Game));
            gen.AddType(typeof(Player));
            
            gen.AddConst("Game", typeof(Game));
            gen.AddConst("Player", typeof(Player));
            gen.AddStaticType("Address", typeof(Address));
            gen.AddConst("Config", typeof(Config));
            gen.AddConst("MonstersInfo", typeof(IReadOnlyDictionary<int, MonsterInfo>));

            gen.AddConst("host", typeof(ExtendedHostFunctions));

            var generatedText = $"// Generated from HunterPie.Core v{typeof(Game).Assembly.GetName().Version} & Plugin v{typeof(AutoHunterPlugin).Assembly.GetName().Version}" 
                                + "\n\n"
                                + gen.GenerateText();
            
            File.WriteAllText("../../../Plugin.AutoHunter/scripts/hunterpie.d.ts", generatedText);
        }
    }
}