using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using HunterPie.Core;
using HunterPie.Core.Input;
using Plugin.AutoHunter.Configuration;
using Plugin.AutoHunter.Utils;
using Plugin.AutoHunter.Widget;

namespace Plugin.AutoHunter
{
    public partial class AutoHunterPlugin
    {
        private Dictionary<string, object> CreateInteropFunctions()
        {
            var pressKey = GetPressKey();

            async Task HoldKey(string arg, int frames)
            {
                ThrowIfTerminated();
                if (Enum.TryParse(arg, out VK key))
                {
                    AddLog($"[Press] {key}");
                    await VirtualInput.HoldKey((char) key, frames).ConfigureAwait(false);
                }
            }

            return new Dictionary<string, object>
            {
                // {"pressKey", new Action<string>(arg => Application.Current.Dispatcher.Invoke(() => pressKey(arg).Wait())) },
                {"pressKeyAsync", pressKey },
                {"holdKeyAsync", (Func<string, int, Task>) HoldKey },
                
                {"pressMultipleKeysAsync", new PressMultipleKeysAction(PressMultipleKeys)},
                {"holdMultipleKeysAsync", new HoldMultipleKeysAction(HoldMultipleKeys)},
                
                {"interruptAllInput", new Func<Task>(VirtualInput.InterruptAllInput)},
                {"interruptLastInput", new Func<Task>(VirtualInput.InterruptLastInput)},
                {"interruptInput", new Func<uint, Task>(VirtualInput.InterruptInput)},
                {"getLastInputId", new Func<uint>(() => VirtualInput.LastInputId)},

                // {"holdKey", new Action<string, int>((key, frames) => holdKey(key, frames).Wait()) },
                
                {"createScreenshot", GetCreateScreenshot()},
                {"updateStateName", new UpdateStateNameAction(UpdateWidget)},
                
                {"createStickyLog", new CreateStickyLogAction(CreateStickyLog)},
                {"updateStickyLog", new Func<string, string, bool>(UpdateStickyLog)},
                
                {"Game", this.Context},
                {"Player", this.Context.Player},
                
                {"MonstersInfo", MonsterData.MonstersInfo},
                {"Memory", this.memoryReader},
                {"Config", ConfigService.Current},
            };
        }

        private StickyLogEntryViewModel CreateStickyLog(string text, string id = null, bool removeOnStateChange = false)
        {
            var stickyLogEntryViewModel = this.grinderWidget.AddStickyLog(text, removeOnStateChange);
            stickyLogEntryViewModel.Id = id;
                
            return stickyLogEntryViewModel;
        }

        private bool UpdateStickyLog(string id, string text)
        {
            var vm = this.grinderWidget.GetStickyLog(id);
            if (vm == null)
            {
                return false;
            }
            vm.UpdateText(text);
            return true;
        }
        
        private Func<string, Task> GetPressKey()
        {
            return async arg =>
            {
                ThrowIfTerminated();
                if (Enum.TryParse(arg, out VK key))
                {
                    AddLog($"[Press] {key}");
                    await VirtualInput.PressKey((char) key).ConfigureAwait(false);
                }
            };
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private void ThrowIfTerminated()
        {
            if (!this.executionEngine.IsEnabled)
                throw new Exception("Script is terminated");
        }

        private async Task PressMultipleKeys(params string[] args)
        {
            ThrowIfTerminated();
            var keys = args.Select(a => (VK) Enum.Parse(typeof(VK), a)).ToArray();
            AddLog($"[Press] ({string.Join(",", keys)})");
            await VirtualInput.PressKeys(keys.Select(k => (char)k).ToArray()).ConfigureAwait(false);
        }
        
        private async Task HoldMultipleKeys(string[] args, int frames)
        {
            ThrowIfTerminated();
            var keys = args.Select(a => (VK) Enum.Parse(typeof(VK), a)).ToArray();
            AddLog($"[Press] ({string.Join(",", keys)}) {frames}");
            await VirtualInput.HoldKeys(keys.Select(k => (char)k).ToArray(), frames).ConfigureAwait(false);
        }

        private Func<string, Task> GetCreateScreenshot() =>
            async key =>
            {
                try
                {
                    var k = key?.ToString() ?? DateTime.Now.Ticks.ToString();
                    await Task.Run(() => ScreenshotService.Capture(k));
                    AddLog($"Captured {k}");
                }
                catch (Exception ex)
                {
                    Logger.Error($"Error on capturing screenshot {key}: {ex}");
                }
            };


        private delegate void UpdateStateNameAction(string arg = null);
        private delegate Task PressMultipleKeysAction(params string[] keys);
        private delegate Task HoldMultipleKeysAction(string[] keys, int frames);
        private delegate StickyLogEntryViewModel CreateStickyLogAction(string text, string id = null, bool removeOnStateChange = false);
    }
}