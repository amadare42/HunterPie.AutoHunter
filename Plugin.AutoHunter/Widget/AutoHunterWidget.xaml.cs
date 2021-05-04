using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Threading;
using HunterPie.Core;
using Plugin.AutoHunter.Configuration;

namespace Plugin.AutoHunter.Widget
{
    /// <summary>
    /// Interaction logic for GrinderWidget.xaml
    /// </summary>
    public partial class AutoHunterWidget : HunterPie.GUI.Widget
    {
        private readonly IConfigService configService;

        public ObservableCollection<LogEntryViewModel> LogEntries { get; } = new();
        public ObservableCollection<StickyLogEntryViewModel> StickyLogEntries { get; } = new();

        public AutoHunterWidget(IConfigService configService)
        {
            this.configService = configService;
            this.WidgetHasContent = true;
            this.WidgetActive = true;
            CompositionTarget.Rendering += CompositionTargetOnRendering;

            InitializeComponent();
            SetWindowFlags();
            ApplyWindowTransparencyFlag();
            ApplySettings();
        }

        private uint renderingFramesCounter = 0;
        private void CompositionTargetOnRendering(object sender, EventArgs e)
        {
            if (!this.IsInitialized) return;

            if (ConfigService.Current.WidgetAlwaysVisible 
                && this.Visibility != Visibility.Visible
                && this.WidgetHasContent 
                && this.WidgetActive
            )
            {
                Show();
            }

            unchecked { this.renderingFramesCounter++; }

            if (this.renderingFramesCounter % 5 == 0)
            {
                TimerOnTick();
            }
        }


        public void InvalidateCountdowns()
        {
            foreach (var entry in this.LogEntries)
            {
                entry.InvalidateCountdown();
            }
        }

        private void TimerOnTick()
        {
            var now = DateTime.Now;
            foreach (var viewModel in this.LogEntries.Where(e => !e.IsOutdated))
            {
                viewModel.UpdateCountdown();
                if (now - viewModel.CreatedTime > TimeSpan.FromMilliseconds(ConfigService.Current.Logs.EntryTimeoutMs) && viewModel.Countdown <= 0)
                {
                    viewModel.IsOutdated = true;
                }
            }
            
            foreach (var b in this.StickyLogEntries.Where(v => v.IsOutdated).ToArray())
            {
                this.StickyLogEntries.Remove(b);
            }

            if (!ConfigService.Current.WidgetAlwaysVisible && this.LogEntries.All(v => v.IsOutdated) && !this.StickyLogEntries.Any())
            {
                DeferredHide();
            }
        }

        public void ClearLogs()
        {
            this.Dispatcher.Invoke(() =>
            {
                foreach (var vm in this.LogEntries)
                {
                    vm.IsOutdated = true;
                }
            });
        }

        public WidgetState WidgetState
        {
            get => (WidgetState)GetValue(WidgetStateProperty);
            set
            {
                if (this.WidgetState?.Phase != value.Phase
                    // TODO: should be handled in better way
                    && !value.Phase.StartsWith("Script reloaded @"))
                {
                    foreach (var entry in this.StickyLogEntries)
                    {
                        if (entry.RemoveOnStateChange) entry.IsOutdated = true;
                    }
                }
                SetValue(WidgetStateProperty, value);
                if (!value.IsEnabled)
                {
                    DeferredHide();
                }

                this.WidgetActive = true;
                ChangeVisibility();
            }
        }

        public LogEntryViewModel AddLog(string text)
        {
            LogEntryViewModel vm = null;
            this.Dispatcher.Invoke(() =>
            {
                vm = new LogEntryViewModel(text);
                this.LogEntries.Insert(0, vm);
                if (this.LogEntries.Count > ConfigService.Current.Logs.MaxEntries)
                {
                    this.LogEntries.RemoveAt(this.LogEntries.Count - 1);
                }

                if (!this.WidgetState?.IsEnabled ?? false)
                {
                    DeferredHide();
                }

                this.WidgetActive = true;
                ChangeVisibility();
            });
            return vm;
        }

        public StickyLogEntryViewModel AddStickyLog(string text, bool hideOnStateChange = false)
        {
            StickyLogEntryViewModel vm = null;
            this.Dispatcher.Invoke(() =>
            {
                vm = new StickyLogEntryViewModel(text)
                {
                    RemoveOnStateChange = hideOnStateChange
                };
                this.StickyLogEntries.Insert(0, vm);

                this.WidgetActive = true;
                ChangeVisibility();
            });
            return vm;
        }

        public StickyLogEntryViewModel GetStickyLog(string id)
        {
            StickyLogEntryViewModel vm = null;
            this.Dispatcher.Invoke(() => vm = this.StickyLogEntries.FirstOrDefault(vm => !string.IsNullOrEmpty(vm.Id) && vm.Id == id));
            return vm;
        }

        public void RemoveStickyLog(StickyLogEntryViewModel vm)
        {
            this.Dispatcher.Invoke(() =>
            {
                this.StickyLogEntries.Remove(vm);
                this.WidgetActive = true;
                ChangeVisibility();
            });
        }

        public void ClearStickyLogs()
        {
            this.Dispatcher.Invoke(() =>
            {
                this.StickyLogEntries.Clear();
            });
        }
        
        private bool IsHiding = false;
        
        private async void DeferredHide()
        {
            if (this.IsHiding) return;
            this.IsHiding = true;
            await Task.Delay(ConfigService.Current.Logs.UpdateTimeoutMs);
            if (!(this.WidgetState?.IsEnabled ?? false) && this.LogEntries.Any(e => !e.IsOutdated))
            {
                this.WidgetActive = false;
                this.ChangeVisibility();
            }

            this.IsHiding = false;
        }

        public static readonly DependencyProperty WidgetStateProperty =
            DependencyProperty.Register(nameof(WidgetState), typeof(WidgetState), typeof(AutoHunterWidget));

        public override void EnterWidgetDesignMode()
        {
            this.ResizeMode = ResizeMode.CanResize;
            base.EnterWidgetDesignMode();
            RemoveWindowTransparencyFlag();
        }

        public override void LeaveWidgetDesignMode()
        {
            this.ResizeMode = ResizeMode.NoResize;
            base.LeaveWidgetDesignMode();
            ApplyWindowTransparencyFlag();
            SaveSettings();
        }

        private void OnMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                MoveWidget();
                SaveSettings();
            }
        }

        public override void SaveSettings()
        {
            var w = this.configService.Current.Widget;

            w.X = (int) this.Left - ConfigManager.Settings.Overlay.Position[0];
            w.Y = (int) this.Top - ConfigManager.Settings.Overlay.Position[1];
            w.Scale = this.DefaultScaleX;
            w.Width = this.ActualWidth;
            
            this.configService.Save();
        }

        public override void ApplySettings() => this.Dispatcher.BeginInvoke(
            DispatcherPriority.Background, new Action(() =>
            {
                var w = this.configService.Current.Widget;

                this.Left = ConfigManager.Settings.Overlay.Position[0] + w.X;
                this.Top = ConfigManager.Settings.Overlay.Position[1] + w.Y;

                ScaleWidget(w.Scale, w.Scale);
                base.ApplySettings();
            }));

        private void OnMouseWheel(object sender, MouseWheelEventArgs e)
        {
            if (e.Delta > 0)
            {
                ScaleWidget(this.DefaultScaleX + 0.05, this.DefaultScaleY + 0.05);
            }
            else
            {
                ScaleWidget(this.DefaultScaleX - 0.05, this.DefaultScaleY - 0.05);
            }
        }
        
        public override void ScaleWidget(double NewScaleX, double NewScaleY)
        {
            if (NewScaleX <= 0.2) return;
            this.Container.LayoutTransform = new ScaleTransform(NewScaleX, NewScaleY);
            this.DefaultScaleX = NewScaleX;
            this.DefaultScaleY = NewScaleY;
            SnapWidget(this.configService.Current.Widget.Width);
        }

        private void SnapWidget(double widgetWidth)
        {
            this.Width = Math.Max(this.Width, widgetWidth);
            this.Resources["LogDismissDistance"] = this.Width;
        }

        private void OnSizeChanged(object sender, SizeChangedEventArgs e)
        {
            e.Handled = true;
            SnapWidget(e.NewSize.Width);
        }

        protected override void OnClosed(EventArgs e)
        {
            CompositionTarget.Rendering -= CompositionTargetOnRendering;
            base.OnClosed(e);
        }
    }
}
