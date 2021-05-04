using System.Windows;

namespace Plugin.AutoHunter.Widget
{
    public class StickyLogEntryViewModel : LogEntryViewModel
    {
        public StickyLogEntryViewModel(string text, int countdown = 0) : base(text, countdown)
        {
        }

        public string Id { get; set; } = null;

        public bool RemoveOnStateChange { get; set; } = false;

        public void UpdateText(string text)
        {
            Application.Current.Dispatcher.InvokeAsync(() =>
            {
                this.Text = text;
                OnPropertyChanged(nameof(this.Text));
                OnPropertyChanged(nameof(this.DisplayText));
            });
        }

        public void Remove()
        {
            Application.Current.Dispatcher.InvokeAsync(() => this.IsOutdated = true);
        }
    }
}