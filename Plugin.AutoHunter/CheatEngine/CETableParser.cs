using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using HunterPie.Memory;
using Plugin.AutoHunter.Configuration;
using Plugin.AutoHunter.Utils;

namespace Plugin.AutoHunter.CheatEngine
{
    public class CeTableParser
    {
        public bool IsReady => Table != null;
        private CheatTable Table { get; set; }

        private Dictionary<string, CheatEntry> EntriesDict;
        
        public void LoadTable(int version)
        {
            var configPath = Path.Combine(Path.GetDirectoryName(typeof(ConfigService).Assembly.Location), "addresses", $"MonsterHunterWorld.{version}.CT");
            if (!File.Exists(configPath))
            {
                throw new Exception(
                    $"No address map found for MHW v.{version}. Probably this version isn't supported yet.");
            }

            using var sr = new StreamReader(configPath);
            this.Table = (CheatTable)new XmlSerializer(typeof(CheatTable)).Deserialize(sr);

            this.EntriesDict = this.Table.CheatEntries
                .SelectMany(ce => new[] {ce}.Concat(ce.CheatEntries))
                .Where(ce => ce.GroupHeader == 0)
                .Where(ce =>
                {
                    if (!ce.RawAddress.Contains('+') || ce.RawAddress.StartsWith("MonsterHunterWorld.exe+"))
                    {
                        return true;
                    }

                    Logger.Warn(
                        $"Invalid format for memory entry '{ce.Description}' (ID: {ce.ID}). Address should be relative to MonsterHunterWorld.exe (e.g. starts with 'MonsterHunterWorld.exe+')!");
                    return false;
                })
                .GroupBy(ce => ce.Description)
                .ToDictionary(gr => gr.Key, gr =>
                {
                    var groupedEntries = gr.ToList();
                    if (groupedEntries.Count > 1)
                    {
                        Logger.Warn($"Found ({groupedEntries.Count}) entries with duplicate name '{gr.Key}': [{string.Join(",", groupedEntries.Select(e => e.ID))}]. Last one will be used.");
                    }

                    return groupedEntries.Last();
                });
            Logger.Info($"Loaded {this.EntriesDict.Count} addresses");
        }

        public long GetAddress(string name)
        {
            var entry = GetEntry(name);
            return Kernel.ReadMultilevelPtr(Address.GetAddress("BASE") + entry.Address, entry.Offsets);
        }

        public CheatEntry GetEntry(string name)
        {
            if (!this.IsReady)
            {
                throw new Exception($"Cannot find resolve address '{name}' - table isn't loaded");
            }

            if (this.EntriesDict.TryGetValue(name, out var entry))
            {
                return entry;
            }
            
            throw new Exception($"Cannot find address with name '{name}' in loaded table");
        }
    }
}