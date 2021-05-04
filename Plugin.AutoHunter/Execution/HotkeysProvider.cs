using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Engine.Js.AddIns;
using HunterPie.Core.Input;

namespace Plugin.AutoHunter.Execution
{
    public class HotkeysProvider : IHotkeysProvider
    {
        private readonly Dictionary<int, HotkeyRegistration> hokeyRegistrations = new();
        
        public event EventHandler<HotkeyEventArgs> OnHotkey;

        public event Action<string> OnLog; 

        public bool IsEnabled { get; set; } = true;

        private int hotkeyIdCounter = 0;
        
        public string Register(string key)
        {
            var hash = GetHotkeyHash(key);
            var hotkeyId = this.hotkeyIdCounter++;
            
            // registration already exists
            if (this.hokeyRegistrations.TryGetValue(hash, out var registration))
            {
                registration.AddHotkey(hotkeyId);
                return hotkeyId.ToString();
            }
            
            // add new registration
            var newRegistration = new HotkeyRegistration(key, this);
            if (newRegistration.Id == -1)
            {
                throw new Exception($"Cannot register hotkey {key}");
            }
            newRegistration.AddHotkey(hotkeyId);

            this.hokeyRegistrations[hash] = newRegistration;
            
            this.OnLog?.Invoke($"Hotkey {key} registered");
            return hotkeyId.ToString();
        }

        public void Unregister(string id)
        {
            if (!int.TryParse(id, out var intId)) return;
            
            var registrations = this.hokeyRegistrations.Values.ToArray();
            foreach (var r in registrations)
            {
                if (!r.RemoveHotkey(intId)) continue;
                if (!r.HasHotkeys)
                {
                    r.Dispose();
                    this.hokeyRegistrations.Remove(r.Id);
                }
                return;
            }
        }

        public void UnregisterAll()
        {
            var registrations = this.hokeyRegistrations.Values.ToArray();
            foreach (var r in registrations)
            {
                r.Dispose();
            }
            this.hokeyRegistrations.Clear();
        }

        public void Invoke(List<int> hotkeyIds)
        {
            if (!this.IsEnabled || this.OnHotkey == null) return;
            Task.Run(() =>
            {
                foreach (var hotkeyId in hotkeyIds)
                {
                    this.OnHotkey(this, new HotkeyEventArgs
                    {
                        Key = hotkeyId.ToString()
                    });
                }
            });
        }

        private static int GetHotkeyHash(string hotkey)
        {
            var codes = Hotkey.ParseStringToHotkeyCode(hotkey);
            if (codes == null) return -1;
            var hash = ((0 ^ codes[0]) * 397) ^ codes[1];
            return hash;
        }
    }

    public class HotkeyRegistration : IDisposable
    {
        public string Key { get; }
        private readonly HotkeysProvider provider;
        public int Id { get; set; }

        public bool HasHotkeys => this.HotkeyIds.Count > 0;

        public List<int> HotkeyIds { get; set; } = new();
        
        public HotkeyRegistration(string key, HotkeysProvider provider)
        {
            this.Key = key;
            this.provider = provider;
            this.Id = Hotkey.Register(key, OnPress);
        }

        public void AddHotkey(int id) => this.HotkeyIds.Add(id);
        public bool RemoveHotkey(int id) => this.HotkeyIds.Remove(id);

        private void OnPress()
        {
            this.provider.Invoke(this.HotkeyIds);
        }

        public void Dispose() => Hotkey.Unregister(this.Id);
    }
}